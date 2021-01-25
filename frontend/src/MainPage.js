import React, {useState} from 'react';

import axios from 'axios';
import { useHistory } from "react-router-dom";

import ConditionList from './ConditionList';

function MainPage() {
    let history = useHistory();

    const [file, setFile] = useState(null);
    const [brwoseFilename, setBrowseFilename] = useState("Browse Files...");
    const [conditions, setConditions] = useState([{
        id: 0,
        parameter: "Analysis Type",
        comparator: ">",
        value: "",
    }]);
    const [error, setError] = useState("");

    const handleSubmit = e => {
        e.preventDefault();

        let formData = new FormData();
        var validForm = true;

        if (file == null) {
            setError("no file selected")
            return;
        }

        let filename = "";
        let filetype = "";
        filename = file.name.split(".");
        filetype = filename.pop();
        filename = filename.join(".") + "_" + Date.now() + "." + filetype;

        formData.append("myfile", file, filename);

        conditions.forEach(condition => {
            if (condition.value === "") {
                validForm = false;
            }
            formData.append(`parametor${condition.id}`, condition.parameter);
            formData.append(`comparator${condition.id}`, condition.comparator);
            formData.append(`value${condition.id}`, condition.value);
        })

        if (!validForm) {
            setError("Please fill out every field")
            return;
        }

        axios.post('/api/upload-file', formData)
        .then(res => {
            if (res.data.success === true) {
                console.log(res.data.file);
                history.push({
                    pathname: '/download',
                    state: res.data.file,
                })
            } else {
                // need to deal with the error in frontend and backend
            }
        });
    }


    const parametorChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].parameter = e.target.value;
            }
        }

        setConditions(c);
    }

    const comparatorChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].comparator = e.target.value;
            }
        }

        setConditions(c);
    }

    const valueChange = (e, id) => {
        let c = [...conditions];

        for (var i in c) {
            if (c[i].id === id) {
                c[i].value = e.target.value;
            }
        }

        setConditions(c);
    }

    const addCondition = condition => {
        setConditions([...conditions, condition]);
        console.log(`added condition: ${condition.id}`)
    }

    const deleteCondition = id => {
        if (conditions.length === 1) return;

        let c = [];
        conditions.forEach(condition => {
            if (condition.id !== id) {
                c.push(condition);
            }
        });

        setConditions(c);
        console.log(`deleted condition: ${id}`)
    }

    return (
        <div className="mainPage">
            <div className="wrapper">
                <h3 className="header">Upload a CSV file</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mainPage__browseFile">
                        <label htmlFor="file" className="mainPage__browseFileButton">{brwoseFilename}</label>
                    </div>
                    <input 
                        id="file" 
                        type="file" 
                        onChange={e => {
                            setFile(e.target.files[0]);
                            setBrowseFilename(e.target.files[0].name);
                        }}
                    />
                    <br />
                    <br />
                    <button className="klButton" type="submit">Upload</button>
                    <br />
                    <br />
                    <div style={{color: "red"}}>{error}</div>
                </form>
                <br />
                <br />
                <ConditionList 
                    conditions={conditions}
                    parametorChange={parametorChange}
                    comparatorChange={comparatorChange}
                    valueChange={valueChange}
                    deleteCondition={deleteCondition}
                />
                <button
                    className="mainPage__browseFileButton"
                    onClick={() => addCondition({
                        id: conditions[conditions.length-1].id + 1 ,
                        parameter: "Analysis Type",
                        comparator: ">",
                        value: "",
                    })}
                >
                    ADD
                </button>
            </div>
        </div>
    )
}

export default MainPage
