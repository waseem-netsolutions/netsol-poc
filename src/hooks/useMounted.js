
import { useEffect, useRef } from 'react'

const useMounted = () => {
  let isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    }
  }, [])
  return isMounted;
}

export default useMounted