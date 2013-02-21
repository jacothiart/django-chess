django-chess is written in Django/Python/Jquery/JqueryUI.

django-chess 0.0.1 introduces a single player chess game against yourself for now.

* The framework combined with the methods used was thought out by programmer and software developer Jaco Thiart.

* This game was initially written in Django/Python/Jquery/JqueryUI as a multi-player strategy game and was then ported to Unity3D(http://wooglie.com/games/strategy/Chess) and after that it was ported back to django-chess on github as a initial single player strategy game against yourself, identified by version 0.0.1.

* This is just the start for gaming in Django, there is more in store for django-chess in the future!

* The ported version in Unity3D do have artificial intelligence to an extend with level, Beginner, Intermediate, Advanced!

* This need to be included into django-chess as well as multi-player gaming with the addition of chess moves Castling and En-Passant.

* django-chess is compatible in all major browsers including Ie6.

Release 0.1.1 was scaled from release 0.0.1 that was a single player game to a mult-iplayer game between browsers.

There is a few concerns in release 0.1.1. But I released it for those want to see that a multi-player chess game in Django can be done.

The concerns include:

* Polling data against the server.
* Reset of a game is done by only refreshing your browser.
* More than 2 users interaction per project interface.


These concerns will all be taken care of in release 0.1.2.


The following instructions in order to play the game apply:

* Run syncdb with the included example_project.
* You only need to install Django to run the code.
* Follow the instructions when running syncdb to create a superuser. This user will be the 1st user that will be able to play against another user.
* Once you have the server running, in the admin add another active user.
* Once this is done, open the 2 separate browsers, for example Chrome + Safari.
* Login with the 2 separate users per open browser.
* Once logged in you'll see a chess board in both browsers.
* On the right you'll see the username of available users you van play chess against.
* In Chrome click on the user, then switch to Safari, an invite will show on the footer.
* Accept it. The person who accepts the invitation may move first.
* Drag the white piece into position and you'll see in Chrome the piece moved. After this you can move the selected black piece in Chrome, then switch browsers again.
* Alter between moves and browsers while playing or just setup a server to play against a friend on separate computers.
* If at any point a bug occur or you want to reset a game, refresh the browser.


Tests:

* This multi-player chess game was tested on Ie6, Mozilla Firefox and Safari on a Windows PC.
* This game is yet to be tested on a Linux PC and a MAC.


Bug reports:

* Help by sending me bug reports.

Changelog:

* A changelog will be released in future releases in order to submit the changes and features.

Documentation:
http://pythonhosted.org/django-chess
This is revision 0.0.1 that includes only pictures!

Thanks for playing!