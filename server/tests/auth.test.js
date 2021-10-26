const request = require('supertest');
const fetch = require('node-fetch');

test('should signin with the known user', async () => {

    const res = await fetch('http://localhost:3001/auth/signin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            email: 'migar256@gmail.com',
            password: 'migar256@gmail.com'
        })
    });

    expect(res.status).toEqual(200);
});


test('not able to signin with  unknown user', async () => {

    const res = await fetch('http://localhost:3001/auth/signin', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            email: 'migar25@gmail.com',
            password: 'migar256@gmail.com'
        })
    });

    expect(res.status).toEqual(401);
});