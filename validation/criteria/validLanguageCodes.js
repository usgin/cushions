module.exports = function (doc) {
  var suggestions = {},
      valid = true,
      validCodes = ['aar','abk','ace','ach','ada','ady','afa','afh','afr','ain','aka','akk','ale','alg','alt','amh','ang','anp','apa','ara','arc','arg','arn','arp','art','arw','asm','ast','ath','aus','ava','ave','awa','aym','aze','bad','bai','bak','bal','bam','ban','bas','bat','bej','bel','bem','ben','ber','bho','bih','bik','bin','bis','bla','bnt','bos','bra','bre','btk','bua','bug','bul','byn','cad','cai','car','cat','cau','ceb','cel','cha','chb','che','chg','chk','chm','chn','cho','chp','chr','chu','chv','chy','cmc','cop','cor','cos','cpe','cpf','cpp','cre','crh','crp','csb','cus','dak','dan','dar','day','del','den','dgr','din','div','doi','dra','dsb','dua','dum','dyu','dzo','efi','egy','eka','elx','eng','enm','epo','est','ewe','ewo','fan','fao','fat','fij','fil','fin','fiu','fon','frm','fro','frr','frs','fry','ful','fur','gaa','gay','gba','gem','gez','gil','gla','gle','glg','glv','gmh','goh','gon','gor','got','grb','grc','grn','gsw','guj','gwi','hai','hat','hau','haw','heb','her','hil','him','hin','hit','hmn','hmo','hrv','hsb','hun','hup','iba','ibo','ido','iii','ijo','iku','ile','ilo','ina','inc','ind','ine','inh','ipk','ira','iro','ita','jav','jbo','jpn','jpr','jrb','kaa','kab','kac','kal','kam','kan','kar','kas','kau','kaw','kaz','kbd','kha','khi','khm','kho','kik','kin','kir','kmb','kok','kom','kon','kor','kos','kpe','krc','krl','kro','kru','kua','kum','kur','kut','lad','lah','lam','lao','lat','lav','lez','lim','lin','lit','lol','loz','ltz','lua','lub','lug','lui','lun','luo','lus','mad','mag','mah','mai','mak','mal','man','map','mar','mas','mdf','mdr','men','mga','mic','min','mis','mkh','mlg','mlt','mnc','mni','mno','moh','mon','mos','mul','mun','mus','mwl','mwr','myn','myv','nah','nai','nap','nau','nav','nbl','nde','ndo','nds','nep','new','nia','nic','niu','nno','nob','nog','non','nor','nqo','nso','nub','nwc','nya','nym','nyn','nyo','nzi','oci','oji','ori','orm','osa','oss','ota','oto','paa','pag','pal','pam','pan','pap','pau','peo','phi','phn','pli','pol','pon','por','pra','pro','pus','que','raj','rap','rar','roa','roh','rom','run','rup','rus','sad','sag','sah','sai','sal','sam','san','sas','sat','scn','sco','sel','sem','sga','sgn','shn','sid','sin','sio','sit','sla','slv','sma','sme','smi','smj','smn','smo','sms','sna','snd','snk','sog','som','son','sot','spa','srd','srn','srp','srr','ssa','ssw','suk','sun','sus','sux','swa','swe','syc','syr','tah','tai','tam','tat','tel','tem','ter','tet','tgk','tgl','tha','tig','tir','tiv','tkl','tlh','tli','tmh','tog','ton','tpi','tsi','tsn','tso','tuk','tum','tup','tur','tut','tvl','twi','tyv','udm','uga','uig','ukr','umb','und','urd','uzb','vai','ven','vie','vol','vot','wak','wal','war','was','wen','wln','wol','xal','xho','yao','yap','yid','yor','ypk','zap','zbl','zen','zha','znd','zul','zun','zxx','zza'];
  
  ['resource_languages', 'metadata_language'].forEach(function (fieldName) {
    if (doc.hasOwnProperty(fieldName)) {
      var value = doc[fieldName];
      
      if (validCodes.indexOf(value) === -1) {
        valid = false;
        
        var suggested = value.toLowerCase();
        
        if (['english'].indexOf(suggested) !== -1 || suggested === '') {
          suggestions[fieldName] = 'eng';
        }
        
        if (validCodes.indexOf(suggested) !== -1) {
          suggestions[fieldName] = suggested;  
        }
      }
    }
  });
  
  var result = {};
  if (Object.keys(suggestions).length > 0) { result.suggestion = suggestions; }
  
  emit(valid, result);
};