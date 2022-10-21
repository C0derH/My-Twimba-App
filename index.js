import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let savedTweetsData 
    
    if(JSON.parse(localStorage.getItem("savedTweets"))){
        savedTweetsData=JSON.parse(localStorage.getItem("savedTweets"))
    }else{
        savedTweetsData=tweetsData
    }



document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
    else if(e.target.dataset.deletebtn){
        handleDeleteBtnClick(e.target.dataset.deletebtn)
    }
})

function handleLikeClick(tweetId){ 
    const targetTweetObj = savedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked 
    saveTweets(savedTweetsData)
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = savedTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveTweets(savedTweetsData)
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        savedTweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        saveTweets(savedTweetsData)
        render()
        tweetInput.value = ''
    }

}
function handleReplyBtnClick(tweetId){
    const targetReplyInput = document.getElementById(`tweet-reply-input-${tweetId}`)
    const targetTweetObj = savedTweetsData.filter(function(tweet){
            return tweet.uuid === tweetId            
    })[0]
    if(targetReplyInput.value){
    targetTweetObj.replies.unshift({
                handle: `@Scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: targetReplyInput.value
            })
    }
    saveTweets(savedTweetsData)
    render()
}

function handleDeleteBtnClick(tweetId){
    const updatedTweets = savedTweetsData.filter(function(tweet){
        return tweetId !== tweet.uuid
    })
    savedTweetsData = updatedTweets
    saveTweets(updatedTweets)
    render()
}

function getFeedHtml(){

    let feedHtml = ``

    savedTweetsData.forEach(function(tweet){

        let deleteIcon = tweet.handle === '@Scrimba' ? `
            <span class="tweet-detail">
                <i class="fa-solid fa-trash"
                data-deletebtn="${tweet.uuid}"
                ></i>
            </span>
        `
        : ""
        
        let likeIconClass = tweet.isLiked ? 'liked' : ""
        let retweetIconClass = tweet.isRetweeted ? 'retweeted' : ""
        
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                ${deleteIcon}
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        <div class="tweet-reply">
            <div class="tweet-inner">
                <img src="./images/scrimbalogo.png" class="profile-pic">
                <textarea id="tweet-reply-input-${tweet.uuid}" placeholder="Tweet your reply"></textarea>
            </div>
            <button data-replybtn="${tweet.uuid}">Reply</button>
        </div>
        ${repliesHtml}
    </div>   
</div>
`
   })

   return feedHtml 

}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

function saveTweets(data){
    localStorage.setItem("savedTweets",JSON.stringify(data))
}

render()


