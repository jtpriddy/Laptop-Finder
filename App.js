import React from 'react';
import axios from 'axios';
import { Flex } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { Square } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Spacer } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react"

var PATH = 'http://localhost/Website/index.php?min=0&max=999999';
var arr = [];
//const handleClick = () => console.log("test");


export default class LaptopList extends React.Component {

    state = {
        arr: [],
        maxPrice: 999999,
        minPrice: 0
    }

    handleClick = (event) => {
        var max = this.state.maxPrice;
        var min = this.state.minPrice;
        PATH = 'http://localhost/Website/index.php?min=' + min + '&max=' + max;
        console.log(PATH);
        axios.get(PATH)
            .then(resp => {
                arr = resp.data;
                this.setState({ arr });
            })
    }

    handleChange = (event) => {
        //console.log(event.target.value);
        this.setState({ maxPrice: event.target.value });
    }

    handleMinChange = (event) => {
        //console.log(event.target.value);
        this.setState({ minPrice: event.target.value });
    }

    componentDidMount() {
        axios.get(PATH)
            .then(resp => {
                arr = resp.data;
                this.setState({ arr });
            })
    }

    render() {
        //console.log(this.state); F08700
        //console.log(this.state.arr.map((url, ndx) => <li key={ndx}>{url}</li>))
        return (
            <>
                <div>
                    <b>Laptop Webscraper</b>
                </div>

                <Flex>
                    <Input placeholder="Min Price" onChange={this.handleMinChange}/>
                    <Input placeholder="Max Price" onChange={this.handleChange}/>
                    <Button colorScheme="teal" onClick={this.handleClick}>Search</Button>
                </Flex>

                <div>
                    {this.state.arr.map((laptop, ndx) => {
                        return (
                            <Flex borderStyle="solid" borderRadius="xl" border="1px" key={ndx} bg="#BBDEF0">
                                <Box padding="15px" roundedLeft="xl" bg="#00A6A6">
                                    <Tooltip label="value score">{parseFloat(laptop['vScore']).toFixed(1)}</Tooltip>
                                </Box>
                                <Box padding="15px" bg="#F49F0A">
                                    <Tooltip label="laptop score">{parseFloat(laptop['lScore']).toFixed(1)}</Tooltip>
                                </Box>
                                <Box padding="15px" bg="#EFCA08">
                                    <Text>${parseFloat(laptop['price']).toFixed(2)}</Text>
                                </Box>
                                <Box p="2">
                                    <Heading size="md">
                                        <a href={laptop['url']}>{laptop['title']}</a>
                                    </Heading>
                                </Box>
                            </Flex>
                        )
                    })}
                </div>
            </>
        );
    }

}