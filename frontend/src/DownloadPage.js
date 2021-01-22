import React, {useState} from 'react';

import axios from 'axios';

function DownloadPage(props) {
    // this is filename and it's from MainPage, where it uses history to redirect page along with sending data
    const {state} = props.location;
    const [html, setHtml] = useState(null);


    const download = () => {
        if (window.confirm("After download, you will be redirected back to the main page")) {
            axios.get(`/api/download-file/${state}`)
            .then(res => {
                // got reponse data (csv data) from server
                var csv = res.data;
    
                // create a link for csv file to be download 
                window.URL = window.webkitURL || window.URL;
    
                // convert the csv content to Blob object, which make the csv become a file
                var contentType = 'text/csv';
                var csvFile = new Blob([csv], {type: contentType});
    
                // create a tag with href of the url and trigger click() even to download automatically
                var a = document.createElement('a');
                a.download = state;
                a.href = window.URL.createObjectURL(csvFile);
                a.click();
                startOVer();
            })
        }
    }

    const view = () => {
        axios.get(`/api/files/${state}`)
        .then(res => {
            setHtml(res.data);
        })
    }

    const startOVer = () => {
        window.location = document.location.origin;
    }

    return (
        <div className="downloadPage">
            <div className="wrapper">
                <h3 className="header">{state}</h3>
                <button className="klButton" onClick={() => download()}>Download</button>
                <button className="klButton" onClick={() => view()}>View</button>
                <button className="klButton" onClick={() => startOVer()}>Start Over</button>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

export default DownloadPage
