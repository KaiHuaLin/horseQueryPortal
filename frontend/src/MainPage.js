import React, {useState} from 'react';

import axios from 'axios';
import { useHistory } from "react-router-dom";

import ConditionList from './ConditionList';

function MainPage() {
    let history = useHistory();

    const [file, setFile] = useState(null);
    const [conditions, setConditions] = useState([{
        id: 0,
        parameter: "Analysis Type",
        comparator: ">",
        value: "",
    }]);

    const handleSubmit = e => {
        e.preventDefault();

        let formData = new FormData();
        var validForm = true;

        if (file == null) {
            console.log("no file uploaded");
            return;
        }

        formData.append("myfile", file, file.name);

        conditions.forEach(condition => {
            if (condition.value === "") {
                validForm = false;
            }
            formData.append(`parametor${condition.id}`, condition.parameter);
            formData.append(`comparator${condition.id}`, condition.comparator);
            formData.append(`value${condition.id}`, condition.value);
        })

        if (!validForm) {
            console.log("emoty value")
            // need to prompt user
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
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={e => {setFile(e.target.files[0])}}/>
                <button type="submit">Upload</button>
            </form>

            <ConditionList 
                conditions={conditions}
                parametorChange={parametorChange}
                comparatorChange={comparatorChange}
                valueChange={valueChange}
                deleteCondition={deleteCondition}
            />

            <button
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
    )
}

export default MainPage
