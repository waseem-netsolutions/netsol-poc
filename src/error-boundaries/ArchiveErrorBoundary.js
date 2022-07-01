import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true,
      error 
    };
  }

  render() {
    const { location, navigate } = this.props;
    //console.log(location)
    if (this.state.hasError) {
      // You can render any custom fallback UI
      this.setState({ hasError: false }, () => {
        return navigate(location.pathname);
      })
      return null
    }

    return this.props.children; 
  }
}

const withLocation = (MyComponent) => {
  return (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <MyComponent location={location} navigate={navigate} {...props} />
  }
}

export default withLocation(ErrorBoundary)