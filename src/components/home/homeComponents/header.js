import {SearchRounded } from "@mui/icons-material";
import { Box, Container, FormControl, IconButton, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useState, useEffect} from "react";
import logo from '../../../landing/icon/logo.svg'

function Header(props) {
    const [open, setOpen]=useState(false)
    const [display, setdisplay]=useState(false)
    const [data, setData]=useState([])
console.log(data)
    const style = styles({display})
    const {search, handleSearch}=props
    
    const openSeach =()=>{
        setOpen(!open)
        if(open){setdisplay('block')};
        setdisplay('none')
    } 

    useEffect(() => {
        const fetchData = async () => {
            const url = `http://localhost:3001/api/BuscarLibroISBN/${search}`;
          const { data } = await axios.get(
            url
          );
            setData(data.data)
        };
      
        fetchData();
    }, []);
    return(
        <Container className={style.ContainerHeader}>
            <Box className={style.boxHeader}>
                <img src={logo} alt="Logo La Casa del Libro" title=""/>
                <IconButton onClick={openSeach} className={style.IconButton}>
                    <SearchRounded/>
                </IconButton>
                
            </Box>
            <FormControl fullWidth >
                <TextField id="outlined-size-small"size="small" variant="outlined" label="Buscador ISBN" type='text' name='search' value={search} onChange={(e)=>handleSearch(e)}
                />
            </FormControl>
        </Container>
        
    )
}
export default Header;

const styles =  makeStyles({
    ContainerHeader:{
        background:'#004d43',
        width:'100%',
        height:'10%',
        minHeight:60,
        display:'flex !important',
        justifyContent:'center',
        padding:'0 !important'
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
    '@media screen and (orientation: portrait)':{
        '@media screen and (min-height:800px)':{
            IconButton:{
                '& svg':{
                    fontSize:'1.5em'
                }
            },
        },
        '@media screen and (min-height:1024px)':{
            IconButton:{
                '& svg':{
                    fontSize:'2em',
                    display:({ display }) => `${display}`
                }
            },
        }
    }
})