<?php

declare(strict_types=1);
/**
 * @copyright 2020 Morris Jobke <hey@morrisjobke.de>
 *
 * @author Morris Jobke <hey@morrisjobke.de>
 *
 * @license MIT
 */

namespace OCA\FilesVideoPlayer\AppInfo;

use OCA\Files\Event\LoadAdditionalScriptsEvent;
use OCA\Files_Sharing\Event\BeforeTemplateRenderedEvent;
use OCA\FilesVideoPlayer\Listener\BeforeTemplateRenderedListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\ContentSecurityPolicy;
use OCP\Security\IContentSecurityPolicyManager;

class Application extends App implements IBootstrap {
	public const APP_ID = 'files_videoplayer';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(BeforeTemplateRenderedEvent::class, BeforeTemplateRenderedListener::class);
	}

	public function boot(IBootContext $context): void {
		$csp = new ContentSecurityPolicy();
		$csp->addAllowedWorkerSrcDomain('\'self\'');
		$csp->addAllowedWorkerSrcDomain('blob:');
		$cspManager = $context->getServerContainer()->query(IContentSecurityPolicyManager::class);
		$cspManager->addDefaultPolicy($csp);
	}
}
