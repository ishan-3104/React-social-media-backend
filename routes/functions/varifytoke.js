 function  verifyToken(req,res,next){
    // console.log(req.headers);
//    const beareHeader = req.body.header
//    console.log(beareHeader);
    // console.log('in function');
    const beareHeader = req.headers['authorization']
    
    if(typeof beareHeader !=="undefined"){
        const beare = beareHeader.split(' ')
        const bearetoken = beare[0]
        
        req.token = bearetoken
        next()
    }
    else{
        res.sendStatus("403")
    }
}
module.exports= verifyToken