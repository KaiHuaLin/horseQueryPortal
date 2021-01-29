import React, {useState} from 'react';

import axios from 'axios';
import { useHistory } from "react-router-dom";

import ConditionList from './ConditionList';

function MainPage() {
    let history = useHistory();

    const [file, setFile] = useState(null);
    const [columns ,setColumns] = useState([]);
    const [browseFilename, setBrowseFilename] = useState("Browse Files...");
    const [conditions, setConditions] = useState([{
        id: 0,
        parameter: "",
        comparator: "",
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

    const parseColumns = file => {
        if (file.type && file.type.indexOf('csv') === -1) {
            window.alert("Please select a csv file");
            setFile(null);
            setBrowseFilename("Browse Files...");
            return;
        }

        const reader = new FileReader();
        reader.onload = e => {
            // convert csv data to string
            const data = e.target.result;

            // get header by getting srting before new line and then split the string by comma
            const headers = data.substr(0, data.indexOf("\n")).split(",");

            // sort the headers alphabatically for easier look up
            headers.sort();
            setColumns(headers);
        }

        reader.readAsText(file);
    }

    return (
        <div className="mainPage">
            <div className="wrapper">
                <h3 className="header">Upload a CSV file</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mainPage__browseFile">
                        <label htmlFor="file" className="mainPage__browseFileButton">{browseFilename}</label>
                    </div>
                    <input 
                        id="file" 
                        type="file" 
                        onChange={e => {
                            if (e.target.files[0] === undefined) {
                                setBrowseFilename("Browse Files...");
                                setFile(null);
                                setColumns([]);
                                setConditions([{
                                    id: 0,
                                    parameter: "",
                                    comparator: "",
                                    value: "",
                                }]);
                                return;
                            }

                            setFile(e.target.files[0]);
                            setBrowseFilename(e.target.files[0].name);
                            parseColumns(e.target.files[0]);
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
                {columns.length === 0 ? (<div></div>) : (
                    <div>
                        <ConditionList 
                            conditions={conditions}
                            parametorChange={parametorChange}
                            comparatorChange={comparatorChange}
                            valueChange={valueChange}
                            deleteCondition={deleteCondition}
                            columns={columns}
                        />
                        <button
                            className="mainPage__browseFileButton"
                            onClick={() => addCondition({
                                id: conditions[conditions.length-1].id + 1 ,
                                parameter: columns[1],
                                comparator: "",
                                value: "",
                            })}
                        >
                            ADD
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MainPage
