import React from 'react'

function Condition(props) {
    return (
        <div className="conditions">
            <select 
                value={props.condition.parametor} 
                onChange={e => props.parametorChange(e, props.condition.id)}
            >
                {
                    props.columns.map(column => (
                        <option key={column} value={column}>{column}</option>
                    ))
                }
            </select>
            <select 
                value={props.condition.comparator} 
                onChange={e => props.comparatorChange(e, props.condition.id)}
            >
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
                <option value="==">{'=='}</option>
            </select>
            <input type="text" 
                value={props.condition.value} 
                onChange={e => props.valueChange(e, props.condition.id)}
            />
            <button 
                style={{cursor: "pointer"}}
                onClick={() => props.deleteCondition(props.condition.id)}
            >
                DELETE
            </button>
            <br />
            <br />
        </div>
    )
}

export default Condition
