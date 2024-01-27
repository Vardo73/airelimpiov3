import Env from '@ioc:Adonis/Core/Env'
import  TwitterApi  from 'twitter-api-v2';

export default class TwitterService{
    private userClient:TwitterApi
    
    public constructor(){
        this.userClient = new TwitterApi({
            appKey: Env.get('TWITTER_API_KEY'),
            appSecret:Env.get('TWITTER_API_KEY_SECRET'),
            accessToken:Env.get('TWITTER_ACCESS_TOKEN'),
            accessSecret:Env.get('TWITTER_ACCESS_TOKEN_SECRET')
        });
    }

    public async post(tweet:string){
        try{
            const postTwit=await this.userClient.v2.tweet(tweet);
            console.log(postTwit)
        }
        catch(error){
            console.log(error)
        }
    }
}