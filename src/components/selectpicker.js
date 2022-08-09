import * as React from 'react';
import Select from 'react-select';

export default function Selectpicker({options}) {
  var opt = [];
  for (let option of options) {
    opt.push({value: option, label: option});
  }
  console.log({opt});
  console.log({options});
  return (
    <Select 
      options={opt}
      isMulti
      isSearchable 
    />
  ); 
}
