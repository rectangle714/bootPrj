import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { GET } from "../../store/fetch-auth-action";
import Styls from'./MainPage.module.css'

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

const MainPage = () => {

    const [value, setValue] = React.useState(0);
    let [rows, setRows] = React.useState([]);

    useEffect(() => {
        rowData();
    },[]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: '이메일', width: 130 },
        { field: 'nickname', headerName: '닉네임', width: 130 },
        {
          field: 'authority',
          headerName: '권한',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: ({value}) => value=='ROLE_USER'? '사용자':'관리자',
        },
      ];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        rowData();
    };

    const rowData = () => {
        const URL = '/member/findAll'
        let response = GET(URL, {});
        response.then((result) => {
            if(result != null) {
                setRows(result.data);
            }
        });
    }

    return (
        <Container maxWidth="md" fixed className={Styls.container}>
            슬라이더 자리
        </Container>
    )
}

export default MainPage;