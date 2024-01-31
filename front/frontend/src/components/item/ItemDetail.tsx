import { useEffect, useState } from "react";
import { itemDetailInfo } from 'store/modules/item';
import { useAppDispatch, useAppSelect } from "store/configureStore";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "@mui/system";
import ItemModal, { Cart } from "./ItemModal";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';

const ItemDetail = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {itemId} = useParams();
    const [imgSrc, setImgSrc] = useState('');
    const [itemDetail, setItemDetail] = useState<any>({});
    const [open, setOpen] = useState(false);
    const modalClose = () => setOpen(false);

    const isLogin = useAppSelect((state) => state.userReducer.isLogin);
    const email = useAppSelect((state) => state.userReducer.email);

    const getItemDetail = async () => {
        const result = await dispatch(itemDetailInfo(itemId));
        if(result.payload != undefined) {
            setItemDetail(result.payload);
          if(result.payload.saveFileList[0] != undefined) {
            setImgSrc(process.env.REACT_APP_FILE_URL + result.payload.saveFileList[0].storedFileName);
          }
        }
    }

    useEffect(() => {
        getItemDetail();
        window.scrollTo(0, 0);  //스크롤 상단으로 이동
    }, []);

    const onClickButton = () => {
        if(isLogin == true) {
            const URL = process.env.REACT_APP_API_URL + '/cart/save';
            let param:Cart = {};
            param.itemId = itemId;
            param.email = email;
            param.quantity = 1;
            axios.post(URL, param)
            .then(function(response) {
                alert('장바구니에 담겼습니다.');
            })
            .catch(function(error) {
                alert('장바구니 담기 실패했습니다.');
            })
        } else {
            alert('로그인을 해주세요.');
            navigate('/login');
        }
      }

    return (
        <>
            <Container style={{minHeight:'170vh'}}>
                <div style={{display:'flex'}}>
                    <div style={{textAlign:'center', width:'100%', paddingTop:'50px'}}>
                        <div>
                            <div style={{fontSize:'28px', fontWeight:'700'}}>{itemDetail.title}</div>
                            <div style={{display:'flex', justifyContent:'center', paddingBottom:'100px', paddingTop:'20px'}}>
                                {itemDetail.saveFileList != undefined ? <img
                                    src={imgSrc}
                                    alt='logo image'
                                    style={{width:'380px', height:'500px'}}
                                    item-id={itemDetail.id}
                                /> : ''}
                                <table style={{paddingLeft:'50px'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width:'200px', fontWeight:'500', height:'100px', borderBottom:'3px solid #eaeaea'}}>
                                                <div style={{textAlign:'left', fontSize:'17px', fontWeight:'700'}}>
                                                    가격 : 
                                                </div>
                                                <div style={{textAlign:'right'}}>
                                                    {itemDetail.price && itemDetail.price.toLocaleString()}원
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{verticalAlign:'top'}}>
                                                <div style={{paddingTop:'20px',textAlign:'left', fontSize:'17px', fontWeight:'700'}}>
                                                    분류 : 
                                                </div>
                                                <div style={{paddingTop:'10px', textAlign:'right', height:'40px', borderBottom:'3px solid #eaeaea'}}>
                                                    {itemDetail.category}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{height:'80px'}}>
                                                <div style={{height: '100%'}}>
                                                    <div style={{verticalAlign:'bottom', borderRadius: '20px', height:'40%', textAlign:'center', 
                                                        paddingTop:'10px', cursor:'pointer', background:'#5055b1'}}>
                                                        <div style={{verticalAlign:'bottom', height:'100%', 
                                                            color:'white', fontWeight:'500'}} onClick={onClickButton}>장바구니 담기</div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width:'100%', borderBottom:'1px solid #d5d5d5'}}>
                    <span style={{fontSize:'28px', fontWeight:'700'}}>리뷰</span>
                    <div style={{float:'right', borderRadius: '20px', textAlign:'center', 
                        cursor:'pointer', background:'#5055b1', width:'11%', height:'30px'}}>
                        <span style={{verticalAlign:'middle', color:'white', fontWeight:'500'}} 
                            onClick={(e) => {setOpen(true)}}>
                            <CreateIcon fontSize="small"/> 리뷰작성
                        </span>
                    </div>
                </div>
            </Container>
            <ItemModal modalValue={itemDetail} imgSrc={imgSrc} open={open} handleClose={modalClose} />
        </>
    )
}

export default ItemDetail;