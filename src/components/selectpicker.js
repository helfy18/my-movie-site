import * as React from 'react';
import Select from 'react-select';

export default function Selectpicker({options}) {
  return (
    <Select 
      options={options}
      isMulti
      isSearchable 
    />
  ); 
}
