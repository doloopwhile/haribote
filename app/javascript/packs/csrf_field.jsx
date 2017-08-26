import React from 'react'

const CsrfField = props => {
  const token = document.querySelector("head > meta[name=csrf-token]").content
  const name = document.querySelector("head > meta[name=csrf-param]").content
  return <input type={"hidden"} value={token} name={name} />
}

export default CsrfField;