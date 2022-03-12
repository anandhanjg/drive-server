const dotenv=require('dotenv');
dotenv.config();
const {OAuth2Client}=require('google-auth-library');
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
module.exports=async function checkGoogleAuth(token){
        try{
            const ticket=await client.verifyIdToken({
                idToken:token,
                audience:[process.env.GOOGLE_CLIENT_ID]
            });
            const payload=ticket.getPayload();
            return Promise.resolve(payload);
        }catch(err){
            return Promise.reject(err);
        }
}