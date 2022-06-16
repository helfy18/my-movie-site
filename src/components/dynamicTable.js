import * as React from 'react'
function DynamicTable({nodes}) {
    const keys = Object.keys(nodes[0]);
    keys.splice(keys.indexOf("id"), 1)

    const ThData = () =>{
        return keys.map((data)=>{
            return <th key={data}>{data}</th>
        })
    }

    const TdData = () =>{
        return nodes.map((data) =>{
            console.log(JSON.stringify(data));
            return(
                <tr key={data.id}> 
                    {
                        keys.map((v)=>{
                            console.log(data[v]);
                            return <td>{data[v]}</td>
                        })
                    }
                </tr>
            )
        })
    }

    return (
        <table className="table">
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