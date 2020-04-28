import React from "react";
import styled from "styled-components";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { push } from "connected-react-router";
import { routes } from "../../containers/Router/index";
import { connect } from "react-redux";
import { postVote, setPostIdSelected } from '../../actions/posts';

class Posts extends React.Component {

    handleGoToPagePostDetails = (postId) => {
        this.props.setPostIdSelected(postId)
        this.props.goToPostDetails()
    }

    render() {
        return (
            <ContainerPosts>
                <Card>
                    <CardContent key={this.props.post.id} onClick={() => this.handleGoToPagePostDetails(this.props.post.id)}>
                        <Typography variant="h5" gutterBottom>
                            {this.props.post.username}
                        </Typography>
                        <hr />
                        <Typography>
                            {this.props.post.title}
                        </Typography>
                        <hr />
                        <Typography>
                            {this.props.post.text}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <ContainerPostsCount>
                            <ArrowUp onClick={() => { this.props.postVote(+1, this.props.post.id) }}>⬆</ArrowUp>
                            <span>{this.props.post.userVoteDirection}</span>
                            <ArrowDown onClick={() => { this.props.postVote(0, this.props.post.id) }}>⬇</ArrowDown>
                        </ContainerPostsCount>
                        <div>
                            <span>comments:</span>
                            <NumberOfComments>{this.props.post.commentsNumber}</NumberOfComments>
                        </div>
                    </CardActions>
                </Card>
            </ContainerPosts>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    postVote: (direction, postId) => dispatch(postVote(direction, postId)),
    goToPostDetails: () => dispatch(push(routes.post)),
    setPostIdSelected: (postId) => dispatch(setPostIdSelected(postId))
})

export default connect(null, mapDispatchToProps)(Posts);


const ContainerPosts = styled.div`
width:30%;
margin:20px auto;
cursor:pointer;
`

const ContainerPostsCount = styled.div`
margin-left:10px;
margin-right:160px;
`

const NumberOfComments = styled.span`
margin-left:5px;
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