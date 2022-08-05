import * as React from 'react'
function DynamicTable({nodes}) {
    const keys = Object.keys(nodes[0]);
    keys.splice(keys.indexOf("id"), 1)

    const ThData = () =>{
        return keys.map((data)=>{
            data = data.replaceAll('_', ' ');
            return <th key={data}>{data}</th>
        })
    }

    const TdData = () =>{
        return nodes.map((data) =>{
            return(
                <tr key={data.id}> 
                    {
                        keys.map((v)=>{
                            return <td key={`${v} ${data[v]} ${data}`}>{data[v]}</td>
                        })
                    }
                </tr>
            )
        })
    }

    return (
        <table id="movieTable" className="table">
            <thead>
                <tr>{ThData()}</tr>
            </thead>
            <tbody>
                {TdData()}
            </tbody>
        </table>
    )
}

export default DynamicTable;