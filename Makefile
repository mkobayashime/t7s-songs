eslint = yarn eslint --ignore-path .gitignore
prettier = yarn prettier --ignore-path .gitignore
ts-node = node --loader ts-node/esm --experimental-specifier-resolution=node

node_modules: package.json yarn.lock
ifeq ($(MAKE_YARN_FROZEN_LOCKFILE), 1)
	yarn install --frozen-lockfile
else
	yarn install
endif
	@touch node_modules

lint: node_modules
	$(eslint) .

lint.fix: node_modules
	$(eslint) --fix .

format: node_modules
	$(prettier) --write .

format.check: node_modules
	$(prettier) --check .

typecheck: node_modules
	yarn tsc --noEmit

typecheck.watch: node_modules
	yarn tsc --noEmit --watch

test: node_modules
	yarn run jest

test.watch: node_modules
	yarn run jest --watch

docgen.offVocal: node_modules
	$(ts-node) src/offVocal.ts
	$(prettier) --write docs

docgen: docgen.offVocal

add.new-song: node_modules
	$(ts-node) bin/addNewSong.ts
	$(prettier) --write data/songs/songs.json
