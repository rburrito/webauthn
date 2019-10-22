import Client from 'webauthn/client';

const client=new Client({pathPrefix:'/webauthn'});

await client.register({
  username:"rburr1t0",
  name:"Rita"
});

await.client.login({username:"rburr1t0"});
