# Heroku & Journey Builder
## Contains a Custom JB Activity

**NOTE:** If you'd like to have multiple Journey Builder Activities, you can simply deploy this to individual branches within this Repo, then assign each Branch to the respective Heroku apps...so a Heroku App for each JB Activity, but all contained in 1 Github Repo. 

### Heroku Config Vars to Configure

* ACTIVITY_DESCRIPTION - description of activity
* ACTIVITY_NAME - name of activity that will be shown in JB
* APP_NAME - name of your Heroku App
* CLIENT_ID - Client Id created in Marketing Cloud's App Center when you created the custom App
* CLIENT_SECRET - Client Secrect from Marketing Cloud's App Center when you created the custom App
* CA_EDIT_URL - https URL of the edit window page (template can be found in this github repo)
* CA_IMG_40 - 40px Custom Activity logo location (absolute URL required)
* CA_IMG_15 - 15px Custom Activity logo location (absolute URL required)
* CA_NUM_STEPS - 1
* EDIT_HEIGHT - height of the Custom Activity config window 
* EDIT_WIDTH - width of the Custom Activity config window
* ENDPOINT_NAME - polar-taiga (or whatever you prefer)
* EXECUTE_ENDPOINT_NAME - URL of the Endpoint you'd like the JB Message to post to (ie. https://my.endpoint.com/jb/webhook?oauth=1234567)
* KEY - Key of Journey Builder Custom Activity created in Marketing Cloud's App Center (this is critical to get right)

The above parameters and their descriptions will be available and configured in the Heroku App when you click on the "Deploy" button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/herokumx/JBActivities)
