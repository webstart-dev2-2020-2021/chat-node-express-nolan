# chat-node-express-nolan (Ninja Chat)
Instant chat working through multiples topic channels
``npm run serve`` to start the server and build the js files.

## Accounts

Account with privileges
``login: admin``
``password: SEYMR97uY44sbXi``

Basic account
``login: superutilisateur1``
``password: MqVzN8BEtbpN8qV``

## Online informations

``http://51.75.124.12:4010``

## Additional informations

The chat is working over multiple rooms. They have to be manually added to the DB, nothing more to make them work.

Nothing is notifying when someone connect cause I've made multiple channels and would just spam every of them but here's a simplified script solution

On socket joins :
	``Channel.selfBot -> User#sendMessage(message, channel_id)``
	``User#sendMessage(object {string, string}, number) -> Server#emit("message", message, channel);``



