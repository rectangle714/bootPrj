import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { removeCookie, getCookie } from '../cookie';
import { createTokenHeader, LoginTokenHandler, reissue  } from './auth'
import { kakaoParam } from "../../components/auth/OAuthLogin";

import axios from 'axios';

export let logoutTimer:NodeJS.Timeout;

const initialState = {
    email: '',
    password: '',
    phone: '',
    nickname: '',
    loading: '',
    isLogin: false,
    role: ''
};

export interface User {
    email: string,
    password: string,
    phone: string,
    nickname: string,
    loading: string,
    isLogin: boolean,
    role: string
}

interface Token {
    grantType: string,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number
}

const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        /** 로그인 **/
        builder.addCase(login.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.email = action.meta.arg.email;
                state.nickname = action.meta.arg.nickname;
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });

        /** 로그아웃 **/
        builder.addCase(logout.fulfilled, (state) => {
            state.email = '';
            state.nickname = '';
            state.isLogin = false;
            state.role = '';
            return state;
        });

        /** 사용자 조회 성공 **/
        builder.addCase(userInfo.fulfilled, (state, action) => {
            console.log('action ',action);
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.nickname = action.payload.nickname;
            state.role = action.payload.role;
            return state;
        });

        /** 사용자 조회 실패 **/
        builder.addCase(userInfo.rejected, (state, action) => {
            state.email = '';
            state.phone = '';
            state.nickname = '';
            state.role = '';
            state.isLogin = false;
            return state;
        });

        /** 사용자 값 변경 성공 **/
        builder.addCase(userUpdate.fulfilled, (state, action) => {
            state.phone = action.meta.arg.phone;
            state.nickname = action.meta.arg.nickname;

            return state;
        });
        
        /** 네이버 로그인 **/
        builder.addCase(naverLogin.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });
        /** 카카오 로그인 **/
        builder.addCase(kakaoLogin.fulfilled, (state, action) => {
            if(action.payload != undefined) {
                state.isLogin = true;
                state.loading = 'success'; 
            }
            return state;
        });
    },
})

/* 회원가입 */
export const signup = createAsyncThunk('SIGNUP', async (user:User) => {
    try{
        const URL = process.env.REACT_APP_API_URL + "/auth/signup";
        const response = await axios.post(URL, user);
        
        return response.status;
    } catch(error) {
        console.log('회원가입 에러발생 : ' + error);
        return undefined;
    }
}); 

/* 로그인 */
export const login = createAsyncThunk('LOGIN', async (user:User) => {
    try {
        console.log('[로그인 시작] : ',user);
        const URL = process.env.REACT_APP_API_URL + '/auth/login';
    
        const response = await axios.post(URL, user);
        if(response.status == 200) {
            const token:Token = response.data;
            LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
        }

        return response.data;
    } catch(error) {
        console.log('로그인 에러발생 : '+ error);
        return undefined;
    }
});

/* 로그아웃 */
export const logout = createAsyncThunk('LOGOUT', async () => {
    try {
        console.log('[로그아웃 시작]');
        const URL = process.env.REACT_APP_API_URL + '/auth/logout';
        let accessToken = '';
        let refreshToken = '';

        if(getCookie('accessToken') != undefined) { accessToken = getCookie('accessToken') } else { throw new Error('accessToken이 존재하지 않습니다.') };
        if(getCookie('refreshToken') != undefined) { refreshToken = getCookie('refreshToken') } else { throw new Error('refreshToken이 존재하지 않습니다.') };

        if(getCookie('accessToken') != undefined || getCookie('refreshToken') != undefined) {
            accessToken = getCookie('accessToken');
            refreshToken = getCookie('refreshToken');
            
            const response = await axios.post(URL, [], createTokenHeader(accessToken, refreshToken));
            if(response.status == 200) {
                console.log('[로그아웃 성공]');
                removeCookie('accessToken');
                removeCookie('refreshToken');
                removeCookie('expirationTime');
            }
        
            return response.data;
        } else {
            throw new Error('로그아웃 에러 발생');
        }

    } catch(error) {
        console.error('로그아웃 에러발생 : '+error);
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('expirationTime');

        if(logoutTimer != null && logoutTimer != undefined){
            clearTimeout(logoutTimer);
            console.log(logoutTimer);
        }

        return undefined;
    }
});

/* 사용자 정보 조회 */
export const userInfo = createAsyncThunk('USER_INFO', async () => {
    console.log('[사용자 조회]');
    const URL = process.env.REACT_APP_API_URL + '/member/me';
    let accessToken = '';
    let refreshToken = '';

    if(getCookie('accessToken') != undefined) { accessToken = getCookie('accessToken') } else { throw new Error('accessToken이 존재하지 않습니다.') };
    if(getCookie('refreshToken') != undefined) { refreshToken = getCookie('refreshToken') } else { throw new Error('refreshToken이 존재하지 않습니다.') };
    const response = await axios.get(URL, createTokenHeader(accessToken, refreshToken));
    if(response.status == 200) {
        reissue(response);
        console.log('[사용자 조회 완료] : ', response);
    }

    return response.data;

});

/* 사용자 전체 정보 조회 */
export const allUserInfo = createAsyncThunk('ALL_USER_INFO', async () => {
    try {
         console.log('[전체 사용자 조회]');
         const URL = process.env.REACT_APP_API_URL + '/member/findAll';
         let accessToken = '';
         let refreshToken = '';

         if(getCookie('accessToken') != undefined) { accessToken = getCookie('accessToken') } else { throw new Error('accessToken이 존재하지 않습니다.') };
         if(getCookie('refreshToken') != undefined) { refreshToken = getCookie('refreshToken') } else { throw new Error('refreshToken이 존재하지 않습니다.') };

         const response = await axios.get(URL, createTokenHeader(accessToken, refreshToken));
         if(response.status == 200) {
            reissue(response);
            console.log('전체 response = ',response);
         }
         return response.data;

    } catch(error) {
        console.error('에러발생 :'+ error);
    }
});

/* 사용자 정보 수정 */
export const userUpdate = createAsyncThunk('USER_UPDATE', async (user:User) => {
    const URL = process.env.REACT_APP_API_URL + '/member/update';

    const response = await axios.post(URL, user);
    if(response.status !== 200) {
        console.log('response ',response);
    }
    return response.status;

});

/* 네이버 로그인 */
export const naverLogin = createAsyncThunk('NAVER_LOGIN', async (token:string) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/naverLogin?token='+token;

    const response = await axios.post(URL);
    if(response.status == 200) {
        const token:Token = response.data;
        LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
    }
    return response.data;

});

/* 카카오 로그인 */
export const kakaoLogin = createAsyncThunk('KAKAO_LOGIN_GET_TOKEN', async (param:kakaoParam) => {
    const URL = process.env.REACT_APP_API_URL + '/auth/kakaoLogin';

    const response = await axios.post(URL, param);
    if(response.status == 200) {
        console.log('2');
        const token:Token = response.data;
        LoginTokenHandler(token.accessToken, token.refreshToken, token.refreshTokenExpiresIn);
    }
    return response.data;
});

export default userSlice.reducer;