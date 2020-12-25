import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { ChakraProvider } from "@chakra-ui/react"
//import { extendTheme } from "@chakra-ui/react"

/*const colors = {
    brand: {
  50: "#e7f6ff",
  100: "#c6daee",
  200: "#a3bedd",
  300: "#80a1cc",
  400: "#5c82bc",
  500: "#4366a3",
  600: "#33547f",
  700: "#23415c",
  800: "#122a3a",
  900: "#01121a"
    },
}*/

//const theme = extendTheme({colors})

ReactDOM.render(
    <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
