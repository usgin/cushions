# Cushions

And you thought metadata wasn't any fun. This application helps find and correct common mistakes in metadata records.

## Installation

You need to have two pre-requesite software packages installed: **Node.js** and **CouchDB**. Fortunately they are not hard to install.

### Node.js

You can find an installer package at http://nodejs.org/download that is appropriate for your computer. For our Windows users, I would suggest picking the appropriate one of these:

- [I have a 64-bit system (most AZGS employees)](http://nodejs.org/dist/v0.10.20/x64/node-v0.10.20-x64.msi)
- [I have a 32-bit system](http://nodejs.org/dist/v0.10.20/node-v0.10.20-x86.msi)

Just download and run the installer. You can verify that it worked by opening a command prompt and typing `node`. If there are no errors and the prompt changes to a `>`, then it worked.

### CouchDB

You can find an installer package at https://couchdb.apache.org/#download that is appropriate for your computer. After clicking one of the links, it will ask you to choose a "mirror", but you should just take the first one that it suggests for you. For our Windows users, this will get you an `.exe` file that you can execute to install CouchDB.

During installation, choose the default options to run CouchDB as a service, and to start the service automatically. Once the installation is complete, you can verify that it installed correctly by pointing your web browser to http://localhost:5984/_utils.

You can also install these pre-requisites in other ways (Homebrew or apt-get, or whatever), as long as you know how to use them properly.

### This Application

Now remember those icons that Node.js installation put on your Desktop? You'll need to run the one called "" in order to install Cushions. Double-clicking this will open a command prompt. If you're using a Unix-style system you probably don't need to worry about this, just open a command prompt. You'll have to use the command prompt, because its good for you and it is totally not hard at all.

1. Type `npm install -g cushions`. You can copy/paste if you'd like to, but you might find typing to be more rewarding.
2. Installed!

## Loading Data

You'll still need that Node.js command prompt open, and you'll need a [CSV file that at least tries to conform to our compilation template](http://schemas.usgin.org/models/#Metadata). You'll need to know the path to your CSV file. Something like `C:\Users\Ryan\Documents\my-csv-file.csv` is probably what you'll be looking for.

Now you've got that in place, you're going to need to be sure you've got CouchDB turned on (check that http://localhost:5984 gives you a little JSON).

Okay, so load some data:

    stuffing -d your-new-database -i path-to-your-csv
    
So, that might end up looking like this:

    stuffing -d stanford -i C:\Users\Ryan\Documents\stanford-metadata.csv
    
This will create a database called `stanford` and load records into it from the CSV file at `C:\Users\Ryan\Documents\stanford-metadata.csv`.
    
Loading will take a little bit of time, depending on the number of records. It will let you know how long it took when its done. Expect it to take about 30 seconds for about 13,000 records.

## Validating Data

You need to turn on Cushions now. From a command prompt type:

    cushions
    
If you see `info  - socket.io started`, then it worked. Leave that command prompt open while you work.

Now Cushions are ready to protect you: your data is loaded into CouchDB, and it is ready to be validated. Go to this URL in your web-browser:

    http://localhost:5984/your-database-name/_design/validation/index.html
    
So, in my case:

    http://localhost:5984/stanford/_design/validation/index.html
    
This will bring up a web site that will begin validating your records. You'll see a list of the criteria that are being used for validation. As the validation completes, it will tell you, for each criteria, how many records are valid, and how many are invalid.

You can click on the results to see a JSON document that describes which records are valid or invalid. You should definintely use a browser extension that will make the JSON prettier so you can read it. 

If the record was invalid, you might get a report describing why it was invalid like 

    "problem": "The title was missing"
    
or

    "problem": "The publication date was invalid"
    
If you're lucky, your problem can be automatically corrected. In that case, there will be a `suggestion` which indicates what Cushions thinks might be what your metadata compiler meant. You can use Cushions to automatically apply these `suggestions` to your metadata content.

### How do I make automatic corrections?

1. Go to the validation page: `http://localhost:5984/your-database-name/_design/validation/index.html`.
2. Push the *Apply Automatic Corrections* button.
3. Wait a little while. Not too long, it will tell you when its done.

### How do I change the validation / correction criteria?

Read some other documentation that I haven't written just yet.
