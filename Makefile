ts-node = node --loader ts-node/esm

install:
	yarn

lint: install
	yarn eslint .

lint.fix: install
	yarn eslint --fix .

format: install
	yarn prettier --write .

format.check: install
	yarn prettier --check .

docgen.offVocal: install
	$(ts-node) src/offVocal.ts
	@make format

docgen: docgen.offVocal
