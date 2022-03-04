import { Fragment } from 'react';

export default function Description(props) {
  const description_arr = []
  console.log(props.description.occurrences)

  props.description.occurrences?.map((value,index) => {
    console.log('value ',value)
    if ( !value.qualifiers ) {
      description_arr.push(<p>{value.value}</p>)
    }
  })
  return (
    <>
    {description_arr.map(descr => descr)}
    </>
  )
}
