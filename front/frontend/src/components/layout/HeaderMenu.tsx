import { useNavigate, useLocation } from "react-router-dom";
import 'styles/layout/HeaderMenu.css'

const HeaderMenu = () => {
    const navigate = useNavigate();

    const onClickMenuItem = (itemIdVal:string, titleVal:string) => {
        navigate('/itemList',{state : {itemId:itemIdVal, title:titleVal}});
    }

    return (
        <>
            <div className="header-menu-wrap">
                <div className="header-menu-contents">
                    <div className="header-menu-item"> 
                        <div>
                            <div style={{cursor:'pointer'}} 
                                onClick={() => onClickMenuItem('/best', '베스트')}>베스트
                            </div>
                            {/* <img src="/images/puppy.png" style={{width: '50px', height: '50px', cursor:'pointer'}}/> */}
                        </div>
                    </div>
                    <div className="header-menu-item">
                        <div>
                            <div style={{cursor:'pointer'}}
                                onClick={() => onClickMenuItem('/novel', '소설')}>소설
                            </div>
                        </div>
                    </div>
                    <div className="header-menu-item">
                        <div>
                            <div style={{cursor:'pointer'}} 
                                onClick={() => onClickMenuItem('/selfImprovement', '자기계발')}>자기계발
                            </div>
                        </div>
                    </div>
                    <div className="header-menu-item">
                        <div>
                            <div style={{cursor:'pointer'}} 
                                onClick={() => onClickMenuItem('/itemList', '인문')}>인문
                            </div>
                        </div>
                    </div>
                    <div className="header-menu-item">
                        <div>
                            <div style={{cursor:'pointer'}} 
                                onClick={() => onClickMenuItem('/essay', '시/에세이')}>시/에세이
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderMenu;