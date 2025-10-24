# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2025-01-27

### Fixed
- Safari compatibility issues with date parsing and formatting
- Enhanced error handling for invalid date strings
- Added debugging logs for date conversion troubleshooting

## [1.1.0] - 2025-01-27

### Changed
- Removed localStorage due date caching for consistent cross-browser behavior
- Simplified due date logic to use static yearly plan (month/day only)

### Fixed
- Due dates now consistent across all browsers and users
- No more different overdue states between browsers

### Improved
- Due date system now uses current year dynamically with month/day from JSON
- Eliminated localStorage due date overrides that caused inconsistencies

## [1.0.1] - 2025-10-24

### Fixed
- Fixed browser caching issue with `data/tasks.json` by implementing cache-busting
- Changed fetch to use absolute path `/data/tasks.json` with `cache: 'no-cache'` option
- Ensures users always get the latest task data without stale cache issues

## [1.0.0] - 2025-10-24

### Added
- Initial release of Tverrkirkelig Årshjul
- Task management system with monthly organization
- Role-based and person-based filtering
- Firebase integration for task status synchronization
- Due date management and overdue task highlighting
- SOP (Standard Operating Procedure) links for tasks
- Responsive design for desktop and mobile
- New year automatic reset functionality
4