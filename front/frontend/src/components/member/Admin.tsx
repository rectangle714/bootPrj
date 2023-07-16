import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { GET } from "../../store/fetch-auth-action";
import Styls from'./Admin.module.css';

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

const Admin = () => {

    const [value, setValue] = useState(0);
    let [rows, setRows] = useState([]);

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
            <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                <Tabs centered={true} value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="회원정보" {...a11yProps(0)} />
                    <Tab label="제품등록" {...a11yProps(1)} />
                    <Tab label="제품조회" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row.id}
                        rows={rows}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                    />
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
                제품등록 내용
            </TabPanel>
            <TabPanel value={value} index={2}>
                제품조회 내용
            </TabPanel>
        </Container>
    )
}

export default Admin;