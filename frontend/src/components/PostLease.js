import React from "react"
import axios from 'axios'

import {Modal, Button, Form, Input, InputNumber, Divider, Spin} from "antd"
import { BASE_URL } from "../Constants";
import './post.css';

class PostLease extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            isModalVisible: false,
            loading: false
        }

        this.showModal = this.showModal.bind(this)
        this.toggle = this.toggle.bind(this)

        this.onFinish = this.onFinish.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }
    
    showModal() {
        this.setState({isModalVisible: true})
    }

    toggle(value) {
        this.setState({loading: value})
    }

    handleCancel() {
        this.setState({isModalVisible: false})
    }

    onFinish(values) {
        this.toggle(true)

        const config = {
            address: this.props.location.address,
            name: values.name,
            price: values.price,
            bed: values.bed,
            bath: values.bath,
            contact: {
                email: values.email,
                phone: values.number
            },
            body: values.lease_body
        }

        if(this.props.new === true)
        {
            axios
                .post(BASE_URL + '/api/location', config)
                .then(response => {
                    axios
                    .post(BASE_URL + '/api/lease', config)
                    .then(response => {
                        console.log('lease sent!')
                        this.toggle(false)
                        this.props.callback()
                        this.handleCancel()
                    })
                    .catch(error => {
                        console.log(error)
                    })
                })
                .catch(error => {
                    console.log(error)
                })

        }
        else
        {
            axios
                .post(BASE_URL + '/api/lease', config)
                .then(response => {
                    console.log('lease sent!')
                    this.toggle(false)
                    this.props.callback()
                    this.handleCancel()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    render() {
        return (
            <div className = 'container'>
                <Button className = 'lease-button' type="primary" onClick={this.showModal}>
                    Post a Lease!
                </Button>
                <Modal 
                    title="Post a lease" 
                    visible={this.state.isModalVisible} 
                    onCancel={this.handleCancel}
                    footer={[]}>
                    <Form
                        onFinish={this.onFinish}>
                        <Input disabled value ={this.props.location.address} addonBefore ={'New lease listing for'}/>
                        <Divider> Leaser Information </Divider>
                        <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please input a name!'}]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                        name="email"
                        label="E-Mail"
                        rules={[{required: true, message: 'Please input an email!'}]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                        name="number"
                        label="Phone Number"
                        rules={[{required: true, message: 'Please input a phone number!'}]}>
                            <InputNumber/>
                        </Form.Item>

                        <Divider> Lease Unit Information </Divider>
                        <Form.Item
                        style = {{ float: 'left'}}
                        name="price"
                        label="Price"
                        rules={[{required: true, message: 'Please input a price!'}]}>
                            <InputNumber formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                        </Form.Item>
                        <p style = {{float: 'left', margin: '5px 8px'}}>per month</p>
                        <Form.Item
                        style = {{width: '100%'}}
                        name="bed"
                        label="Beds"
                        rules={[{required: true, message: 'Please input the number of beds!'}]}>
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item
                        name="bath"
                        label="Baths"
                        rules={[{required: true, message: 'Please input the number of baths!'}]}>
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item
                        name="lease_body"
                        rules={[{required: true, message: 'Please input a body!'}]}>
                            <Input.TextArea placeholder="Write any additional info here" rows={5}/>
                        </Form.Item>

                        <div style = {{position: 'relative', bottom: '20px'}}>
                        <Form.Item style={{float: "right", margin: '5px', position: "relative"}}>
                            <Button 
                                type="primary" 
                                htmlType="submit"
                            >
                                    Submit
                            </Button>
                        </Form.Item>

                        <Button 
                            danger 
                            onClick={this.handleCancel} 
                            style={{float: "right", margin: '5px', position: "relative"}}>
                                Cancel
                        </Button>
                        </div>
                    </Form>
                    <Spin spinning={this.state.loading}></Spin>
                </Modal>
            </div>
        )
    }
}

export default PostLease