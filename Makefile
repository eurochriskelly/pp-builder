# Makefile for GCP CLI Tools

# Variables
NAME = gcp
SOURCE = bin/gcp.ts
INSTALL_DIR = /usr/local/bin
TS_NODE = node_modules/.bin/ts-node
NPM = npm

# Default target: show help
.PHONY: help
help:
	@echo "Makefile for GCP CLI Tools"
	@echo ""
	@echo "Usage:"
	@echo "  make install    Install the gcp script to $(INSTALL_DIR)"
	@echo "  make uninstall  Remove the gcp script from $(INSTALL_DIR)"
	@echo "  make deps       Install project dependencies"
	@echo "  make clean      Remove node_modules and installed script"
	@echo ""

# Install dependencies
.PHONY: deps
deps:
	@$(NPM) install

# Install the script to /usr/local/bin
.PHONY: install
install: deps
	@echo "Installing $(NAME) to $(INSTALL_DIR)..."
	@sed 's|^#!/usr/bin/env node|#!/usr/bin/env $(TS_NODE)|' $(SOURCE) > $(NAME)
	@chmod +x $(NAME)
	@sudo mv $(NAME) $(INSTALL_DIR)/$(NAME)
	@echo "Installation complete! Type 'gcp' to use the tool."

# Uninstall the script
.PHONY: uninstall
uninstall:
	@echo "Uninstalling $(NAME) from $(INSTALL_DIR)..."
	@sudo rm -f $(INSTALL_DIR)/$(NAME)
	@echo "Uninstallation complete."

# Clean up project directory and installed script
.PHONY: clean
clean: uninstall
	@echo "Cleaning up project directory..."
	@rm -rf node_modules package-lock.json
	@echo "Cleanup complete."
