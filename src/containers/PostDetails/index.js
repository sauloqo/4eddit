import React, { Component } from "react";
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { routes } from '../Router';
import TextField from '@material-ui/core/TextField';
import Logo from '../../4eddit.png';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import { getPostDetail, postVote, createComment, voteComment } from '../../actions/posts';

const addComment = [
   {
      name: "text",
      type: "text",
      label: "Write your text",
      required: true,
      variant: "outlined",
      color: "secondary",
   },
]

class PostDetails extends Component {
   constructor(props) {
      super(props)
      this.state = {
         comments: "",
      }
   }

   componentDidMount() {
      const token = window.localStorage.getItem("token")
      if (token === null) {
         this.props.goToLoginPage()
         window.alert("Área restrita. Faça seu login")
      } else if (this.props.postIdSelected !== "") {
         this.props.getPostDetail(this.props.postIdSelected)
      } else {
         this.props.gotToFeedPage()
      };
   };

   handleInputChanges = event => {
      const { name, value } = event.target;
      this.setState({ comments: { ...this.state.comments, [name]: value } });
   };

   handleCreateComment = (event) => {
      event.preventDefault()
      const { text } = this.state.comments;
      const { postIdSelected } = this.props
      this.props.createComment(text, postIdSelected)
      this.setState({ comments: "" })
   };

   render() {
      const { postDetails } = this.props
      return (
         <StyledMainContainer key="">
            <StyledImg src={Logo} alt="imagem da logo" />
            <StyledTitle>Post Details</StyledTitle>

            <ContainerButtonBack>
               <StyledBackButton
                  multiline
                  onClick={this.props.gotToFeedPage}
                  color="primary"
                  variant="contained">
                  Go Back
               </StyledBackButton>
            </ContainerButtonBack>

            <StyledCardsContainer>
               <Card>
                  <CardContent>
                     <Typography variant="h5" gutterBottom>
                        <span>{postDetails.username}</span>
                     </Typography>
                     <hr />
                     <Typography>
                        <span>{postDetails.text}</span>
                     </Typography>
                  </CardContent>

                  <CardActions>
                     <ContainerPostsCount>
                        <ArrowUp onClick={() => { this.props.postVote(+1, postDetails.id) }}>⬆</ArrowUp>
                        <span>{postDetails.userVoteDirection}</span>
                        <ArrowDown onClick={() => { this.props.postVote(0, postDetails.id) }}>⬇</ArrowDown>
                     </ContainerPostsCount>
                     <div>
                        <span>comments:</span>
                        <NumberOfComments>{postDetails.commentsNumber}</NumberOfComments>
                     </div>
                  </CardActions>
               </Card>

               <StyledCard>
                  <CardContent>
                     <AddCommentContainer>
                        <form>
                           {addComment.map((input, index) => (
                              <StyledInputComment
                                 key={index}
                                 name={input.name}
                                 value={this.state.comments[input.name] || ""}
                                 id={input.name}
                                 label={input.label}
                                 variant={input.variant}
                                 type={input.type}
                                 onChange={this.handleInputChanges}
                                 multiline
                                 color={input.color}
                              />
                           ))}
                        </form>
                     </AddCommentContainer>
                     <StyledButton
                        onClick={this.handleCreateComment}
                        color="secondary"
                        variant="contained">
                        Add Comment
                     </StyledButton>
                  </CardContent>
               </StyledCard>

               <StyledTitle>Comments</StyledTitle>
               {postDetails.comments && postDetails.comments.map((comment, index) => (
                  <CommentsContainer key={index}>
                     <h3>{comment.username}</h3>
                     <p>{comment.text}</p>

                     <ArrowUp onClick={() => this.props.voteComment(+1,
                        this.props.postIdSelected,
                        comment.id)}>⬆ </ArrowUp>

                     <span>{comment.votesCount}</span>

                     <ArrowDown onClick={() => this.props.voteComment(0,
                        this.props.postIdSelected,
                        comment.id)}>⬇</ArrowDown>
                  </CommentsContainer>
               ))}

            </StyledCardsContainer>
         </StyledMainContainer>
      );
   }
}

function mapStateToProps(state) {
   return {
      postDetails: state.posts.postDetails,
      postIdSelected: state.posts.postIdSelected,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      goToLoginPage: () => dispatch(push(routes.root)),
      gotToFeedPage: () => dispatch(push(routes.feed)),
      getPostDetail: (postId) => dispatch(getPostDetail(postId)),
      postVote: (direction, postId) => dispatch(postVote(direction, postId)),
      createComment: (text, postId) => dispatch(createComment(text, postId)),
      voteComment: (direction, postId, commentId) => dispatch(voteComment(direction, postId, commentId))
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);

const StyledMainContainer = styled.div`
   width:30%;
   margin:20px auto;
   text-align:center;
`

const StyledImg = styled.img`
   max-width: 20vw;
   height: auto;
`

const StyledTitle = styled.h1`
   color: white;
   text-shadow: 1px 1px black;

`

const StyledCardsContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
`

const AddCommentContainer = styled.div`
   width: 330px;
   margin: 15px;
   padding: 20px;
`

const StyledInputComment = styled(TextField)`
   :focus {
      color: black;
   }
`

const CommentsContainer = styled.div`
   margin: 15px 300px;
   text-align: center;
   box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
   padding: 20px;
   width: 350px;  
   background: white;
   border-radius: 5px;
`

const ContainerPostsCount = styled.div`
   margin-left:10px;
   margin-right:240px;
`

const ArrowUp = styled.span`
   cursor:pointer;
   font-size:17px;
   margin-right:2px;
   color:green;
`

const ArrowDown = styled.span`
   cursor:pointer;
   font-size:17px;
   margin-left:2px;
   color:red;
`

const NumberOfComments = styled.span`
   margin-left:5px;
`

const ContainerButtonBack = styled.div`
   margin: 50px 0px;
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

const StyledCard = styled(Card)`
   margin-top: 15px;
`

const StyledBackButton = styled(Fab)`
   position: fixed;
   bottom: 50px;
   right: 30px;
   background: #ffb08f;
   text-shadow: 1px 1px black;
   font-weight: bold;
   color: white;
   :hover {
      background: #c75839;
   }
`