import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import finamParse from './functions/finamParse';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import Graph from './components/graph/Graph';

function App() {
  const [graphProps, setGraphProps] = useState({data: [], max: 0, min: 0});
  const [parsed, setParsed] = useState([]);
  const [file, setFile] = useState();

  useEffect(() => {
    if( file ) { 
      var reader = new FileReader();
      reader.onload = function (e) {
        let textData = e.target.result
        setParsed(finamParse(textData));
      };
      reader.readAsText(file);
    }
  }, [file])

  useEffect(() => {
    if( parsed.length ) {
      const minMaxObj = parsed.reduce((args, obj) => {
        if(obj) {
          return {
            maxHigh: (obj.high > args.maxHigh ? obj.high : args.maxHigh),
            minLow: (obj.low < args.minLow ? obj.low : args.minLow),
          }
        }
      }, {maxHigh: -Infinity, minLow: Infinity});

      var timeDiff = Math.abs(parsed[0].dateTime.getTime() - parsed[1].dateTime.getTime());
      var period = timeDiff / (1000 * 60); 

      const maxVolume = parsed.reduce((maxVol, obj) => obj.vol > maxVol ? obj.vol : maxVol, -Infinity)

      setGraphProps({
        data: parsed,
        max: Math.max(minMaxObj.maxHigh),
        min: Math.min(minMaxObj.minLow),
        period,
        maxVol: maxVolume
      })
    }
  }, [parsed])


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <>
      <div className="top-buttons">
        <Button
          component = "label"
          role = {undefined}
          variant = "contained"
          color = "warning"
          tabIndex = {-1}
          startIcon = {<CloudUploadIcon />}
        >
          Загрузить файл
          <VisuallyHiddenInput
            type ="file"
            accept = ".csv,.txt"
            onChange = {(event) => setFile(event.target.files[0])}
            multiple
          />
        </Button>
      </div>
      <div>
        <Graph {...graphProps}/>
      </div>
    </>
  )
}

export default App
