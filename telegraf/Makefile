SHELL  := /bin/bash

#COLORS
RED    := $(shell tput -Txterm setaf 1)
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

.PHONY: help
.DEFAULT_GOAL := help

help:
	@echo '$(WHITE)Comand from devolopment and build: $(RESET):'
	@echo '$(YELLOW)build$(RESET):'
	@echo '  $(GREEN)build   $(RESET) - build environment: dev'
	@echo '$(YELLOW)development$(RESET):'
	@echo '  $(GREEN)dev-test$(RESET) - build app and run test'
	@echo '  $(GREEN)test    $(RESET) - unit-test code'
	@echo '  $(GREEN)watch   $(RESET) - clear, build and watch bot.ts'
	@echo '  $(GREEN)build   $(RESET) - builds new bot'
	@echo '  $(GREEN)clear   $(RED) - очистка папки созданного кода'
	@echo '  $(GREEN)start   $(RESET) - start bot, not watch'

dev-test: build test

test:
ifndef Dev
	@npm run test
endif

watch: 
ifndef Dev
	@npm run dev
endif

start: 
ifndef Start
	@npm run start
endif

clear: 
ifndef Clear
	@npx gulp clear
endif

build: 
ifndef Build
	@npm run build
endif

# build-%: ENVIRONMENT=$(subst build-,,$@)
# build-%: dep ionic platform
# 	$(if ${BUILD_OPT},, $(error $(RED)Build environment ${ENVIRONMENT} is not defined$(RESET) ) )
# 	@echo "$(GREEN)Build: ${ENVIRONMENT}$(RESET)..."
# 	@cd $(APP_PATH) && ionic build $(BUILD_OPT)

# serve: dep ionic
# 	@echo '$(GREEN)Serve$(RESET)...'
# 	@cd $(APP_PATH) && ionic serve --no-open

# dep: dir
# 	@cd $(APP_PATH) && \
# 	if ! [ -d 'node_modules' ]; then \
# 		echo "$(GREEN)Dependencies$(RESET)..."; \
# 		npm install; \
# 	fi

# platform: dir ionic
# 	@echo '$(GREEN)Platform$(RESET)...'
# 	@cd $(APP_PATH) && \
# 	ionic cordova platform add ios

# ### create/remove angular sketch

# remove: dir confirm
# 	@echo "$(GREEN)Remove app folder: '$(APP_PATH)'$(RESET)..."
# 	@rm -rf $(APP_PATH)

# new: ionic
# 	$(if $(APP_EXIST), $(error $(RED)App path '$(APP_PATH)' is $(APP_EXIST) already exists$(RESET) ) )
# 	@echo "$(GREEN)New $(APP_EXIST)$(RESET)..."
# 	@ionic start $(APP_NAME) blank --condova --no-git --no-deps --no-link --display-name '$(APP_NAME)' && \
# 	mv $(APP_NAME) $(APP_PATH)

# dir:
# 	$(if $(APP_EXIST),, $(error $(RED)App path '$(APP_PATH)' is not exists$(RESET) ) )

### helpers

confirm:
	$(if $(shell read -p "Are you sure $(RED)Yes$(RESET)/$(GREEN)No$(RESET)? " && shopt -s nocasematch && [[ "$$REPLY" =~ "yes" ]] && echo 'yes' ),, $(error $(RED)No$(RESET). ) )
# @echo '$(GREEN)Yes$(RESET).'
