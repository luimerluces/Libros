import { Container, Box, FormControl, IconButton, Modal, TextField , CardContent, Typography,Card, Button, Accordion, AccordionDetails, AccordionSummary, Tooltip, Menu, MenuItem, CardHeader, CardMedia, Divider, Collapse, InputBase} from "@mui/material";
import { useEffect, useState } from "react";
import {AddCircleRounded, BookRounded, ExitToAppRounded, MoreRounded, MoreVertRounded, PhotoCamera, SearchRounded } from "@mui/icons-material";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Banner from '../../landing/images/novedades.jpg'
import logo from '../../landing/icon/logo.svg'
import { useAuthContext } from "../../context/authContext";
// value = 0 es editar
// valur = 1 es eliminar

function Home (){
    var token=sessionStorage.getItem('token');
    const { logout } = useAuthContext();
    const [data, setData] = useState([]);
    const [search, setSearch]=useState('')
    const [open, setOpen]=useState(false)
    const [options, setOptions]=useState(false)
    const [openModal, setOpenModal]=useState(false)
    const [id, setID]=useState()
    const [action, setAction]=useState()
    const [consolaSeleccionada, setConsolaSeleccionada]=useState({
        Id_Book: '',
        ISBN:'',
        BookTitle: '',
        BookAuthor: '',
        YearOfPublication:'',
        Publisher:'',
        ImageURLS:'',
        ImageURLM:'',
        ImageURLL:''
    })
    const [anchorEl, setAnchorEl] = useState(null);
    const abrir = Boolean(anchorEl);
    const handleClick = (event,index) => {
        setID(index)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (value) => {
        
        const {tabIndex} = value.target
        setAnchorEl(null);
        setAction(tabIndex)
        console.log(tabIndex)
        handleModal(tabIndex)
    };
    const style = styles()
    useEffect(() => {
        const fetchData = async () => {
            const url = "http://localhost:3001/api/ListarLibros";
            const { data } = await axios.get(
            url, {headers: {'Authorization': `Bearer ${token}`},}
          );
            setData(data.data)
        };
      
        fetchData();
    }, []);

    const fetchDataSearch = async () => {
        const urlISBN =  `http://localhost:3001/api/BuscarLibroISBN/${search}`;
        const urlID =  `http://localhost:3001/api/BuscarLibro/${search}`;
        let url;
        if(search.length>=10){
            url = urlISBN
        }else{
            url=urlID
        }
        const { data } = await axios.get(
            url,{headers: {'Authorization': `Bearer ${token}`},}
        );
        console.log(data.data)
            setData(data.data)
    };

    const fetchDataID = async () => {
        const urlID =  `http://localhost:3001/api/BuscarLibro/${id}`;
        const { data } = await axios.get(
            urlID,{headers: {'Authorization': `Bearer ${token}`},}
        );
        console.log(data.data)
        setConsolaSeleccionada(data.data[0])
    }
    const fechNew = async () => {
        var datosEnviar={
            isnb : consolaSeleccionada.ISBN,
            Title : consolaSeleccionada.BookTitle,
            Author : consolaSeleccionada.BookAuthor,
            Publication : consolaSeleccionada.YearOfPublication,
            Publisher : consolaSeleccionada.Publisher,
            ImageURLS : consolaSeleccionada.ImageURLS,
            ImageURLM: consolaSeleccionada.ImageURLM,
            ImageURLL: consolaSeleccionada.ImageURLL,
        } 
        const urlID =  `http://localhost:3001/api/AddNewBook`;
        const { data } = await axios.post(
            urlID, {headers: {'Authorization': `Bearer ${token}`},datosEnviar}
        );
        console.log(data)
    }
    
    const handleModal=(e)=>{
        setAction(e)
        setOpenModal(!openModal)
        if (action === 0) {
            fetchDataID()
        }
    }
    const fetchDataEdit = async () => {
        const urlID =  `http://localhost:3001/api/UpdateBook/`;
        var datosEnviar={
            Isbn : consolaSeleccionada.ISBN,
            Title : consolaSeleccionada.BookTitle,
            Author : consolaSeleccionada.BookAuthor,
            Publication : consolaSeleccionada.YearOfPublication,
            Publisher : consolaSeleccionada.Publisher,
            ImageURLS : consolaSeleccionada.ImageURLS,
            ImageURLM: consolaSeleccionada.ImageURLM,
            ImageURLL: consolaSeleccionada.ImageURLL,
        } 
        const { data }= await axios.put(
            urlID, {headers: {'Authorization': `Bearer ${token}`},datosEnviar}
        );
    }
    const fetchDataDelete = async () => {
        const urlDelete =  `http://localhost:3001/api/InactivarBook/${id}`;
        const { data }= await axios.delete(
            urlDelete,{headers: {'Authorization': `Bearer ${token}`},}
        );
        if(data.status===200){
            window.location.replace('')
        }
        
    }
    const handleConfirm=()=>{
        console.log(action)
        setOpenModal(!openModal)
        switch (action) {
            case -1:
                fetchDataDelete()
                break;
            case 0:
                fetchDataEdit()    
                break;
            case 1:
                fechNew()    
                break;
            default:
                break;
        }
    }
    const handleSearch=(e)=>{
        const {value, name}=e.target
        setSearch(value)
    }
    const handleChange=e=>{
        const {name, value, files}=e.target;
        console.log(e)
        if (files!==null) {
            setConsolaSeleccionada(prevState=>({
                ...prevState,
                [name]: files[0]
              }))
        }
        setConsolaSeleccionada(prevState=>({
          ...prevState,
          [name]: value
        }))
    }
    const actualizar = <Box sx={{background:'#fff', width:'50%', height:'50%', left:'25%', top:'25%', position:'relative'}}>
        <h3 style={{textAlign:'center'}}>{action>0?'Create New Book':'Edit Book Data'}</h3>
        <div style={{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around'}} className='agruparEdit'>
            <div style={{width:'40%',display: 'flex', flexDirection: 'column'}} className='grupoEdit'>
            <TextField name="ISBN" className={styles.inputMaterial} onChange={handleChange} label="ISBN"  value={consolaSeleccionada && consolaSeleccionada.ISBN}/>
            <br />
            <TextField name="BookTitle" className={styles.inputMaterial} onChange={handleChange} label="Title" value={consolaSeleccionada && consolaSeleccionada.BookTitle}/>
            <br />
            <TextField name="BookAuthor" className={styles.inputMaterial} onChange={handleChange} label="Author" value={consolaSeleccionada && consolaSeleccionada.BookAuthor}/>
            <br />
            <TextField name="YearOfPublication" className={styles.inputMaterial} onChange={handleChange} label="Publication" value={consolaSeleccionada && consolaSeleccionada.YearOfPublication}/>
            <br />
            </div>
            <div style={{width:'40%',display: 'flex', flexDirection: 'column'}} className='grupoEdit'>
            <TextField name="Publisher" className={styles.inputMaterial} type='text' onChange={handleChange} label="Publisher" value={consolaSeleccionada && consolaSeleccionada.Publisher}/>
            <br />
            <Button variant="contained" component="label">
                Upload ImageURLS
                <input name="ImageURLS" hidden accept="image/*" type="file" onChange={handleChange}/>
            </Button>
            <br />
            <Button variant="contained" component="label">
                Upload ImageURLM
                <input name="ImageURLM" hidden accept="image/*" onChange={handleChange} type="file" />
            </Button>
            <br />
            <Button variant="contained" component="label">
                Upload ImageURLL
                <input name="ImageURLL" hidden accept="image/*" onChange={handleChange} type="file" />
            </Button>
            <br />
        <div align="bottom">
            <Button color="primary" onClick={handleConfirm}>Save</Button>
            <Button onClick={()=>{setOpenModal(false)}}>Cancel</Button>
        </div>
            </div>
        </div>
    </Box>

    const eliminar =<Box sx={{background:'#fff', width:'35%', height:'35%', left:'33%', top:'33%', position:'relative', p:'2%'}}>
        <Typography variant="h3" sx={{fontSize:'1.5em'}}>Sure you want to perform this action?</Typography>
        <Button onClick={handleConfirm}>Confirm</Button>
        <Button onClick={()=>{setOpenModal(false)}}>Cancel</Button>
    </Box>
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
    setExpanded(!expanded);
    };
    console.log(action)
    return(
        <Container className={style.containerHome}>
            <Box className={style.ContainerHeader}>
                <Box className={style.boxHeader}>
                    <img src={logo} alt='logo' title=""/>
                    <IconButton className={style.IconButton} onClick={handleExpandClick}>
                        <SearchRounded/>
                    </IconButton>
                    <TextField 
                        className={style.inputBase2} placeholder={'Search for Id and ISBN'}
                        variant="outlined"  name='Password' value={search} onChange={handleSearch}
                        InputProps={{
                        endAdornment:(
                            <IconButton onClick={fetchDataSearch} style={{width:'10%',height:'100%'}} aria-label="toggle password visibility" edge="end">
                                <SearchRounded  sx={{fill:'#fff'}}/>
                            </IconButton>
                            )
                        }}
                    />
                    <IconButton className={style.IconRegistrer} onClick={()=>logout()}>
                        <ExitToAppRounded/>
                    </IconButton>
                </Box>
                <Collapse in={expanded} timeout="auto" unmountOnExit sx={{width:'100%', minHeight:'45px !important', background:'#02362f', display:'flex', justifyContent:'center','& .css-9l5vo-MuiCollapse-wrapperInner':{display:'flex', justifyContent:'center', alignItems:'center'}}}>
                <InputBase className={style.inputBase}
                    placeholder="Search by ISBN and Id"
                    name="search" type="text" value={'algo'}
                    inputProps={{ 'aria-label': 'search' }}
                    
                />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchRounded  sx={{fill:'#fff'}}/>
                </IconButton>
                </Collapse>
            </Box>
            <Box className={style.banner}>
                <Box className={style.boxContent}>
                        <Card className={style.cardSource1}>
                           <IconButton sx={{width:'100%', height:'100%'}} onClick={(e)=>handleModal(e.target.tabIndex+2)}>
                                <AddCircleRounded sx={{fontSize:'5em'}}/>
                           </IconButton>
                        </Card>
                    {data.map((recurso, index)=>(
                        <Card  key={index} className={style.cardSource}>
                            <CardHeader className={style.headerSource}
                                action={
                                    <Tooltip title='Options'>
                                        <IconButton onClick={(e)=>handleClick(e, index+1)} aria-label="settings">
                                            <MoreVertRounded />
                                        </IconButton>
                                    </Tooltip>
                                    
                                }
                                title={`Author: ${recurso.BookAuthor}`}
                                subheader={`Estado: ${recurso.Estatus}`}
                            />
                             <CardMedia
                                component="img"
                                image={recurso.ImageURLM}
                                alt={`Imagen de ${recurso.BookTitle}`}
                                title=""
                            />
                            <Divider/>
                            <CardContent key={index}  className={style.contentSource}>
                                <p>{`Title: ${recurso.BookTitle}`}</p>
                                <p>{`Publisher: ${recurso.Publisher}`}</p>
                                <p>{`ISBN: ${recurso.ISBN}`}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={abrir}
                        onClick={handleClose}
                        PaperProps={{
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={(e)=>handleClose(e)}>
                            Update Book
                        </MenuItem>
                        <MenuItem onClick={(e)=>handleClose(e)}>
                            Delete Book
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>
            <Modal
                open={openModal}
                onClose={handleModal}
            >
                {action>-1?actualizar:eliminar}
            </Modal>
        </Container>
    )
}

export default Home;

const styles = makeStyles({
    containerHome:{
        width:'100%',
        height:'100%',
        maxWidth:'unset !important',
        padding:'0 !important',
        display: "flex !important",
        flexDirection: "column",
        alignItems:'center',
    },
    banner:{
        width:'90%',
        height:'90%',
        paddingTop:'1%',
        minHeight:450,
        overflowY:'scroll',
        '& img':{
            height:'70%',
            width:'100%',
            minHeight:150,
            minWidth:120
        }
    },
    card:{
        background:'#004d43 !important',
        color:'#fff !important',
        width:'100%',
        height:'25%',
        position:'relative',
        top:'-10%',
        borderRadius:'0 !important',
        '& h3':{
            fontSize:28,
            fontWeight:800
        },
        '& p':{
            fontSize:14,
            fontWeight:500,
            paddingBottom:'2%'
        }
    },
    button:{
        width:'100%',
        background:'#ebaa20 !important',
        height:'10%',
        color:'#000 !important'
    },
    boxContent:{
        width:'100%',
        height:'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 20%))',
        gridGap: 10,
        justifyItems: 'center',
        justifyContent: 'center',
    },
    cardSource:{
        width:'100%',
        height:'100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight:300
    },
    cardSource1:{
        width:'100%',
        height:'100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    },
    contentSource:{
        width:'100%',
        height:'85%',
        '& img':{
            height: '80%',
            width: 'auto',
        },
        '& p':{
            width: 230,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        }
    },
    ContainerHeader:{
        background:'#004d43',
        width:'100%',
        height:'15%',
        minHeight:75,
        display:'flex !important',
        flexDirection:'column',
        justifyContent:'center',
        paddingBottom:0,
        alignItems:'center',
        maxWidth:'unset !important'
    },
    boxHeader:{
        width:'90%',
        height:'100%',
        display:"flex",
        alignItems:'center',
        justifyContent:'space-between',
        '& img':{
            width:'40%',
            height:'auto'
        }
    },
    IconButton:{
        '& svg':{
            fill:'#fff'
        }
    },
    inputBase:{
        width:'70%',
        height:'85%',
        border: '1px solid #fff',
        borderRadius: '1em',
        '& .css-9rtivs-MuiInputBase-root':{border:'unset', borderRadius:0, color:'#fff'},
        '& input':{
            color:'#fff',
            marginLeft:'14px !important'
        }
    },
    inputBase2:{
        width:'70%',
        height:'85%',
        border: '1px solid #fff',
        borderRadius: '1em',
        '& .css-9rtivs-MuiInputBase-root':{border:'unset', borderRadius:0, color:'#fff'},
        '& input':{
            color:'#fff',
            marginLeft:'14px !important'
        }
    },
    boxSearch:{
        background:'#0f433a',
        height:'45%',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        '&  .MuiFormControl-root':{
            background:'#fff',
            width:'60%'
        },
        '&  .MuiFormControl-root div' :{
            width:'100%'
        }
    },
    cardSource1:{
        display:'none'
    },
    headerSource:{
        display:'none !important'
    },
    '@media screen and (orientation: portrait)':{
        inputBase2:{
            display:'none !important'
        },
        butonnone:{
            display:'none !important'
        },
        IconRegistrer:{
            display:'none !important'
        },
        '@media screen and (min-height:800px)':{
            banner:{
                '& img':{
                    height:'45%'
                }
            },
            card:{
                height:'20%',
                '& h3':{
                    fontSize:30,
                },
                '& p':{
                    fontSize:16,
                }
            },
            boxContent:{
                justifyContent:'space-around'
            },
            contentSource:{
                '& img':{
                    height: '80%',
                    width: 'auto',
                },
            },
            IconButton:{
                '& svg':{
                    fontSize:'1.5em'
                }
            },
        },
        '@media screen and (min-height:1024px)':{
            banner:{
                '& img':{
                    height:'40%'
                }
            },
            card:{
                height:'16%',
                '& div':{
                    display:'grid',
                    gridTemplateColumns:'70% 30%',
                    gridTemplateRows:'40% 60%',
                    alignItems:'center',
                    height:'100%'
                },
                '& h3':{
                    fontSize:30,
                    gridRow:'1/2',
                    gridColumn:'1/2'
                },
                '& p':{
                    fontSize:16,
                    gridRow:'2/3',
                    gridColumn:'1/2'
                }
            },
            button:{
                width:'90%',
                height:'40%',
                gridRow:'1/3',
                gridColumn:'2/3'
            },
            IconButton:{
                '& svg':{
                    fontSize:'2em',
                }
            },
        }
    },
    '@media screen and (orientation: landscape)':{
        cardSource:{
            maxHeight:350,
            padding:'2%'
        },
        cardSource1:{
            maxHeight:350,
            padding:'2%',
            '& button':{
                width:'100%',
                height:'100%',
                '& svg':{
                    fontSize:'5em'
                }
            },
            '& .css-78trlr-MuiButtonBase-root-MuiIconButton-root:hover':{
                    backgroundColor:'unset'
            }
        },
        banner:{
            width:'100%',
            '& img':{
                width:'auto',
                height:'45%',
                minWidth:'unset !important'
            }
        },
        headerSource:{
            display:'flex !important',
            width:'100%',
            '& div':{ 
                '& span':{
                    fontSize:'1em'
                }
            }
        },
        ContainerHeader:{
            flexDirection:'row'
        },
        boxHeader:{
            width:'100%',
            justifyContent:'space-around',
            '& img':{
                width:'50%',
                height:'auto',
                maxWidth:330
            }
        },
        boxSearch:{
            background:'transparent',
            display:'flex !important',
            height:'45%',
            alignItems:'center',
            justifyContent:'center',
            width:'61%',
            '&  .MuiFormControl-root':{
                background:'#fff',
                width:'60%'
            },
            '&  .MuiFormControl-root div' :{
                width:'100%'
            }
        },
        IconButton:{
            display:'none !important',
            '& svg':{
                fontSize:'2em',
            }
        },
        IconRegistrer:{
            display:'block !important'
        },
        inputBase2:{
            width: '54%',
            border: '1px solid #fff !important',
            height: 'auto',
            borderRadius: '1em',
        },
        cardSource1:{
            width:'100%',
            height:'100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center'
        },
        contentSource:{
            width:'100%',
            height:'85%',
            '& img':{
                height: '80%',
                width: 'auto',
            },
            '& p':{
                width: 230,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
            }
        },
    }
})