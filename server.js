//some basic steps
//step-1 : first we will install express 
//step-2 : we will install mustache for template engine in express framework
//step-3 : we will set up app engine for template engine. 
//step-4 : we will install body pareser for read the url data coming from post method


const express = require('express');         //this is use to initialise express fraework
const mustacheExpress = require('mustache-express');    //this is use to initialise to mustache template
const bodyParser = require('body-parser');      //this is use to initialise to bodyParser
const app = express();                  //this is the express object for using its methods
const mysql = require('mysql');

const mustache = mustacheExpress();     //this is the mustacheExpress object for using its methods
mustache.cache = null;                  //we will set mustache cache to null
app.engine('mustache', mustache);       //here we are using this to set template engine
app.set('view engine', 'mustache');      

app.use(express.static('public'));      //here we are telling to use files in public folder
app.use(bodyParser.urlencoded({extended:false}));  //here we are using body-parser method for collecting data from frontend to backend


app.get('/add', (req, res)=>{           //here we are using get method to get information when we use '/add' directive with ip-address then it will render/display the 'med-form.mustache' from view folder. 
    res.render('med-form');             //res - response, req - request
})

config={
    user : 'root',
    host: 'localhost',
    database: 'medical',
    password: 'saket12345',
    port: 3307,

}

//data insertion from form to database
app.post('/meds/add', (req, res)=>{     //here we are using post method to post the information when we use '/meds/add' directiver with ip-address then it will redirect to 'meds.mustache' from view folder.
    console.log('post body',req.body);
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection completed');
        const params = [req.body.name, req.body.composition, req.body.brand, req.body.count, req.body.price ];
        const sql = `insert into meds (name, composition, brand, count, price) values ("${params[0]}", "${params[1]}", "${params[2]}", "${params[3]}", "${params[4]}")`;
        client.query(sql,function(err, result){
            if(err) throw err;
            console.log("Record inserted");
            res.redirect("/meds");
        });
    });
});

//fetching the data in meds page.
app.get('/meds', (req, res)=>{
    console.log('view body',res.body);
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection completed');
        const sql = `select * from meds`;
        client.query(sql,function(err, results, fields){
            if(err) throw err;
            results=JSON.parse(JSON.stringify(results));
            var dict = {'rows' : results};
            console.log(dict);
            res.render('meds', dict);            
        });
    });
});

//deleting a data from meds page
app.post('/meds/delete/:id', (req, res)=>{
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection completed');
        const sql = `delete from meds where id="${req.params.id}"`;
        client.query(sql, function(err, result){
            if(err) throw err;
            console.log('Record deleted');
            res.redirect('/meds');
        });
    });
});

//editing data from meds page
app.get('/meds/edit/:id', (req, res)=>{
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection completed');
        const sql = `select * from meds where id="${req.params.id}"`;
        client.query(sql, function(err, results){
            if(err) throw err;
            results = JSON.parse(JSON.stringify(results));
            var dict = {'med': results};
            console.log(dict, " ", dict.med[0].composition);
            res.render('meds-edit', dict);
        });
    });
});

//saving the editted data
app.post('/meds/edit/:id', (req, res)=>{
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection successful');
        const params = [req.body.name, req.body.composition, req.body.brand, req.body.count, req.body.price];
        const sql = `update meds set name="${params[0]}", composition="${params[1]}", brand="${params[2]}", count="${params[3]}", price="${params[4]}" where id="${req.params.id}"`;
        client.query(sql, function(err, result){
            if(err) throw err;
            console.log('result?', result);
            res.redirect('/meds');
        })
    })
})

//creating dashboard
app.get('/dashboard', (req, res)=>{
    const client = mysql.createConnection(config);
    client.connect(function(err){
        if(err) throw err;
        console.log('Connection successful');
        var res1;
        var res2;
        client.query(`select sum(count) as sum from meds;`, function(err, result){
            if(err) throw err;
            res1 = JSON.parse(JSON.stringify(result[0]));
            console.log('?result', res1);
            //console.log('?results', results[1]);
            res.render('dashboard', res1);
        });
    });
})
app.listen('5001',()=>{                    //here we are telling that app is listening to server with port-address '5001'
    console.log('Listening to port 5001');
})
