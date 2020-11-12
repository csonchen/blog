import React, { useEffect, useState }from 'react'
import { Button } from 'react-bootstrap'

function LoadingButton(props) {
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoading) {
      props.fetchApi().then(() => {
        setLoading(false)
      })
    }
  }, [isLoading, props])

  const handleClick = () => setLoading(true)

  return (
    <Button 
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {props.children}
    </Button>
  )
}

export default LoadingButton
