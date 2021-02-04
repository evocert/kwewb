ZIP=zip
UNZIP=unzip
SRC=./lib
TGTDIR=./dist
TGT=$(TGTDIR)/lib.zip
all:dist_
dist_:
	-rm -rf $(TGTDIR)
	mkdir $(TGTDIR)
	$(ZIP) -r $(TGT) $(SRC)
	cp ./index.html $(TGTDIR)
	cp ./index.js $(TGTDIR)
	cp ./favicon.ico $(TGTDIR)
clean:
	-rm -rf $(TGTDIR)
.phony:dist_ clean
