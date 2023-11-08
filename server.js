const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Use the uuid package for generating unique IDs
const path = require('path')
const app = express();
const port = 3000;

app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public"))

app.get('/notes',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/notes.html'))
})

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'))
})
// app.get('/assets/css/styles.css',(req,res)=>{
//     res.sendFile(path.join(__dirname,'./public/assets/css/styles.css'))
// })

app.get('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,content)=>{
        if(err){
            console.log(err)
        }else{
            var data = JSON.parse(content)
            res.json(data)
        }
    })
})

// Endpoint for creating a new note
app.post('/api/notes', (req, res) => {
  try {
    const newNote = req.body; // Assuming the request body contains the new note
    newNote.id = uuidv4(); // Generate a unique ID for the note

    // Read existing notes from the db.json file
    const existingNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

    // Add the new note to the existing notes
    existingNotes.push(newNote);

    // Write the updated notes back to the db.json file
    fs.writeFileSync('./db/db.json', JSON.stringify(existingNotes, null, 2), 'utf-8');

    res.status(201).json(newNote); // Respond with the new note, including its unique ID
  } catch (error) {
    console.error('Error creating a new note:', error);
    res.status(500).json({ error: 'An error occurred while creating a new note.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

