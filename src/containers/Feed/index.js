import React, { Component } from "react";
import styled from "styled-components";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Logo from '../../4eddit.png'
import Posts from '../../components/Posts'
import { push } from "connected-react-router";
import { routes } from "../Router";
import { connect } from "react-redux";
import { getPosts, createPost } from "../../actions/posts";

const formFeed = [
    {
        name: "title",
        type: "text",
        label: "Título",
        required: true,
        color: "secondary"
    },
    {
        name: "text",
        type: "text",
        label: "Escreva seu post",
        required: true,
        color: "secondary"
    }
]

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
        };
    }

    componentDidMount() {
        if (localStorage.getItem("token") === null) {
            this.props.goToLoginPage()
            window.alert("Área restrita. Faça seu login")
        }
        this.props.getPosts()
    }

    handleFieldChange = event => {
        const { name, value } = event.target;
        this.setState({ form: { ...this.state.form, [name]: value } });
    };

    sendNewPost = (event) => {
        event.preventDefault()
        const { title, text } = this.state.form
        this.props.createPost(title, text)
    }

    render() {
        return (
            <Container>
                <StyledImg src={Logo} alt="imagem da logo" />                
                <StyledInputContainer>
                    <StyleText>New Post: </StyleText>
                    <form onSubmit={this.sendPostData}>
                        {formFeed.map(input => (
                            <div key={input.name}>
                                <TextField
                                    multiline
                                    onChange={this.handleFieldChange}
                                    name={input.name}
                                    type={input.type}
                                    label={input.label}
                                    value={this.state.form[input.name] || ""}
                                    color={input.color}
                                />
                            </div>
                        ))}
                        <ContainerButton>
                            <StyledButton
                                onClick={this.sendNewPost}
                                color="primary"
                                variant="contained">
                                Post
                                </StyledButton>
                        </ContainerButton>
                    </form>
                </StyledInputContainer>                
                <StyledFeed>Posts</StyledFeed>
                {this.props.getToPosts.map((post, index) => (
                    <Posts key={index} post={post} onClick={this.props.onClick}></Posts>
                ))}
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    getToPosts: state.posts.allPosts,
});

const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (title, text) => dispatch(createPost(title, text)),
        getPosts: () => dispatch(getPosts()),
        goToPostDetails: () => dispatch(push(routes.post)),
        goToLoginPage: () => dispatch(push(routes.root)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const StyledImg = styled.img`
   max-width: 15vw;
   height: auto;
   margin-bottom:50px;
`

const Container = styled.div`
    margin:auto;
    text-align:center;
`

const StyledFeed = styled.h1`
    font-size:40px;
    color: white;
    text-shadow: 2px 1px black;
`

const ContainerButton = styled.div`
    margin-top:15px;
    padding-bottom:20px;
`

const StyledInputContainer = styled.div`
    background: white;
    padding: 70px 0;
`

const StyleText = styled.h2`
    font-size: 18pt;
`

const StyledButton = styled(Button)`
   background: #ffb08f;
   text-shadow: 1px 1px black;
   font-weight: bold;
   color: white;
   :hover {
      background: #c75839;
   }
`