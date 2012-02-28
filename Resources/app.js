/*globals TitaniumOAuth*/

// includes
Ti.include('lib/titanium_oauth.js');

// ui *******************************************
var tabGroup = Ti.UI.createTabGroup();

// setup tab ------------------------------------
var winSetup = Ti.UI.createWindow({
	title: 'setup',
	backgroundColor: 'black'
});

var textFieldTop=5;

var addTextField = function(window, propertyName) {
	var textField = Ti.UI.createTextField({
		hintText: propertyName,
		value: Ti.App.Properties.getString(propertyName),
		top: '' + textFieldTop + 'dp',
		height: '30dp',
		left: '5dp',
		right: '5dp',
		backgroundColor: 'white',
		autocapitalization: 0,
		font: {fontSize: '12dp'}
	});
	
	textField.addEventListener('change', function(e) {
		Ti.App.Properties.setString(propertyName, e.value);
	});
	
	window.add(textField);
	textFieldTop += 35;
};

addTextField(winSetup, 'consumer_key');
addTextField(winSetup, 'consumer_secret');
addTextField(winSetup, 'request_token_url');
addTextField(winSetup, 'authorize_url');
addTextField(winSetup, 'access_token_url');

tabGroup.addTab(Ti.UI.createTab({
	title: winSetup.title,
	window: winSetup
}));

// test tab --------------------------------------
var winTest = Ti.UI.createWindow({
	title: 'test',
	backgroundColor: 'black'
});

textFieldTop=5;

addTextField(winTest, 'method');
addTextField(winTest, 'action');
addTextField(winTest, 'parameter_name_1');
addTextField(winTest, 'parameter_value_1');
addTextField(winTest, 'parameter_name_2');
addTextField(winTest, 'parameter_value_2');
addTextField(winTest, 'parameter_name_3');
addTextField(winTest, 'parameter_value_3');

var b1 = Ti.UI.createButton({
	bottom: '10dp',
	left: '10dp',
	right: '10dp',
	height: '50dp',
	title: 'test'
});

winTest.add(b1);

tabGroup.addTab(Ti.UI.createTab({
	title: winTest.title,
	window: winTest
}));

// events
b1.addEventListener('click', function(){
	var parameters = {
		consumerKey: Ti.App.Properties.getString('consumer_key'),
		consumerSecret: Ti.App.Properties.getString('consumer_secret'),
		requestTokenURL: Ti.App.Properties.getString('request_token_url'),
		userAuthorizationURL: Ti.App.Properties.getString('authorize_url'),
		accessTokenURL: Ti.App.Properties.getString('access_token_url'),
		getPin: function(authWebView) {
			var html = authWebView.evalJS("document.getElementById('oauth_pin').innerHTML");
			if (html != '') {
				var regex = new RegExp("([0-9]+)", "m"); 
				if (regex) {
					var pin = html.match(regex)[0]; 
					if (pin) {
						return pin;
					}
				}
			}
			return null;
		}
	};
	
	// to reset tokens
	//Ti.App.Properties.setString('accessToken', null);
	//Ti.App.Properties.setString('accessTokenSecret', null);

	if (parameters.consumerKey && 
		parameters.consumerSecret &&
		parameters.requestTokenURL &&
		parameters.userAuthorizationURL &&
		parameters.accessTokenURL &&
		typeof parameters.getPin === 'function') {
			
		var options = {
			method: Ti.App.Properties.getString('method'),
			action: Ti.App.Properties.getString('action'),
			parameters: [], // will be setted later
			
			parameter_name_1: Ti.App.Properties.getString('parameter_name_1'),
			parameter_value_1: Ti.App.Properties.getString('parameter_value_1'),
			parameter_name_2: Ti.App.Properties.getString('parameter_name_2'),
			parameter_value_2: Ti.App.Properties.getString('parameter_value_2'),
			parameter_name_3: Ti.App.Properties.getString('parameter_name_3'),
			parameter_value_3: Ti.App.Properties.getString('parameter_value_3')
		};

		if (options.method && 
			options.action &&
			options.parameter_name_1 &&
			options.parameter_value_1) {
				
			var aAux=[];
			aAux.push(options.parameter_name_1);
			aAux.push(options.parameter_value_1);
			options.parameters.push(aAux);
			
			if (options.parameter_name_2 && options.parameter_value_2) {
				aAux.push(options.parameter_name_2);
				aAux.push(options.parameter_value_2);
				options.parameters.push(aAux);
			}
 	
			if (options.parameter_name_3 && options.parameter_value_3) {
				aAux.push(options.parameter_name_3);
				aAux.push(options.parameter_value_3);
				options.parameters.push(aAux);
			}
 	
			var oauth = new TitaniumOAuth(parameters);
		
			oauth.requestToken(function() {
			    oauth.request(options, function(data) {
			        Ti.API.info('#response is: ' + data);
			        alert('#response is: ' + data);
			    });
			});
		} else {
			alert('Did you forget the test params?');
		}
	} else {
		alert('Did you forget the setup?');
	}
});


// starting app
tabGroup.open();
