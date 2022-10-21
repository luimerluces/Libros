import { Box, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from 'react-swipeable-views-utils';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from "react";
import axios, { Axios } from "axios";


function Carousel() {
    const theme = useTheme
    const style = styles();
    const [data, setData] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const handleStepChange = (step) => {
        console.log(step)
    setActiveStep(step);
    };
console.log(activeStep)
    useEffect(() => {
        const fetchData = async () => {
          const { data } = await axios.get(
            "http://localhost:3001/api/ListarLibros"
          );
            setData(data.data)
        };
      
        fetchData();
    }, []);

    return(
        <Box className={style.boxCarousel}>
            {data.map((recurso, index)=>(
                <Card  key={index} className={styles.cardSource1}>
                    <CardContent key={index}  className={styles.contentSource1}>
                        <p>{recurso.BookTitle}</p>
                        <img src={recurso.ImageURLM} alt={`Logo Atenas de ${recurso.name}`} title=""/>
                    </CardContent>
                </Card>
            ))}
        </Box>
    )
}
export default Carousel;

const styles = makeStyles(()=>({
    boxCarousel:{
        background:'#004d43',
        width:'100%',
        height:'10%'
    },
    carousel:{
        height: '70%',
        width:'100%',
        '& .react-swipeable-view-container':{
            overflow: 'visible',
            height: '100%',
            alignItems: 'center',
        },
        '& .react-swipeable-view-container div':{
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            background:'transparent',
            display:'flex',
            width:'85%',
            boxShadow:'unset'
        }
    },
}))