import * as React from 'react'
export default function DynamicTable({nodes}) {
    const keys = Object.keys(nodes[0]);
    keys.splice(keys.indexOf("id"), 1);
    keys.splice(1, 0, 'Rank');

    const ThData = () =>{
        return keys.map((data)=>{
            data = data.replaceAll('_', ' ');
            return <th key={data}>{data}</th>
        })
    }
  
    const TdData = () =>{
        var rank = 1;
        return nodes.map((data) =>{
            return(
                <tr key={data.id}> 
                    {
                        keys.map((v)=>{
                            if (v === 'Rank') {
                              return <td key={`${v} ${rank}`}>{rank++}</td>
                            }
                            if (typeof data[v] === 'string') {data[v] = data[v].replaceAll('"', '');}
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
