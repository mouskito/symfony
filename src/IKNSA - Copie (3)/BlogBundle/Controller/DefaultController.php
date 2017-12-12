<?php

namespace IKNSA\BlogBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('IKNSABlogBundle:Default:index.html.twig');
    }
}
