const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');


const loadLogin = async (req, res) => {
    
        return res.render('admin/login');
    
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const admin = await adminModel.findOne({ email });
        if (!admin) return res.render('admin/login', { message: 'Invalid credentials' });

       
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.render('admin/login', { message: 'Invalid credentials' });

     
        req.session.admin = true;
        console.log("admin session set into to true",req.session.admin)
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send('Something went wrong. Please try again.');
    }
};


const loadDashboard = async (req, res) => {
    try {
        // const admin = req.session.admin;
        // if (!admin) return res.redirect('/admin/login');

        const users = await userModel.find({});
        res.render('admin/dashboard', { users,message:null });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};


const editUser = async (req, res) => {
    try {
        const { email, name, password, id } = req.body;

        
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    console.log(hashedPassword);
       
        const updateFields = {
            email,
            name,
        };

        if (hashedPassword) updateFields.password = hashedPassword;

        await userModel.findOneAndUpdate({ _id: id }, { $set: updateFields });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to edit user.');
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userModel.findOneAndDelete({ _id: id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to delete user.');
    }
};


const addUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;


        const existingUser=await userModel.findOne({email});
        if(existingUser){
            const users = await userModel.find({});
             return res.render("admin/dashboard", {users,message:"User Already Exists"})

        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            email,
            name,
            password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to add user.');
    }
};


const logout = async (req, res) => {
    req.session.admin = null;
    res.redirect('/admin/login');
};


const searchUser = (req, res) => {
    const searchQuery = req.body.search; // Get the search term from the form
    if (!searchQuery) {
        return res.redirect('/admin/dashboard'); // Redirect if search query is empty
    }

    userModel.find({
        $or: [
            { name: new RegExp(searchQuery, 'i') },
            { email: new RegExp(searchQuery, 'i') }
        ]
    })
    .then(users => {
        res.render('admin/dashboard', { users, searchQuery, message: `` });
    })
    .catch(err => {
        console.error(err);
        res.render('admin/dashboard', { users: [], searchQuery, message: 'Error retrieving users.' });
    });
};


module.exports = { loadLogin, login, loadDashboard, editUser, deleteUser, addUser, logout,searchUser, };
