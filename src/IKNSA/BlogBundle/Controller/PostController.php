<?php

namespace IKNSA\BlogBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use IKNSA\BlogBundle\Entity\Post;
use IKNSA\BlogBundle\Entity\Comment;
use IKNSA\BlogBundle\Form\PostType;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Post controller.
 *
 */
class PostController extends Controller
{
    /**
     * Lists all Post entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $posts = $em->getRepository('IKNSABlogBundle:Post')->getLastInserted('IKNSABlogBundle:Post', 3);

        return $this->render('post/index.html.twig', array(
            'posts' => $posts,
        ));
    }

    /**
     * Lists all post entities in JSON.
     *
     */
    public function restfulListAction()
    {
        $em = $this->getDoctrine()->getManager();
        $posts = $em->getRepository('IKNSABlogBundle:Post')->findAll();

        return $this->json([
            "posts" => $posts
        ]);
    }

    /**
     * Creates a new Post entity.
     *
     */
    public function newAction(Request $request)
    {
        if(!$this->getUser()) {
            $this->addFlash('notice', 'You must be identified to access this section');

            return $this->redirectToRoute('post_index');
        }

        $post = new Post();
        $form = $this->createForm('IKNSA\BlogBundle\Form\PostType', $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $post->setUser($this->getUser());
            $em->persist($post);
            $em->flush();

            return $this->redirectToRoute('post_show', array('id' => $post->getId()));
        }

        return $this->render('post/new.html.twig', array(
            'post' => $post,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Post entity.
     *
     */
    public function showAction(Post $post, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $comments = $em->getRepository("IKNSABlogBundle:Comment")->findByPost($post);

        $comment = new Comment();
        $comment->setPost($post);
        $comment->setUser($this->getUser());

        $form = $this->createForm('IKNSA\BlogBundle\Form\CommentType', $comment);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($comment);
            $em->flush();

            return $this->redirect($request->headers->get('referer'));
        }

        $deleteForm = $this->createDeleteForm($post);

        return $this->render('post/show.html.twig', array(
            'post' => $post,
            "form" => $form->createView(),
            'delete_form' => $deleteForm->createView(),
            "comments" => $comments
        ));
    }

    /**
     * Displays a form to edit an existing Post entity.
     *
     */
    public function editAction(Request $request, Post $post)
    {
        $deleteForm = $this->createDeleteForm($post);
        $editForm = $this->createForm('IKNSA\BlogBundle\Form\PostType', $post);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($post);
            $em->flush();

            return $this->redirectToRoute('post_show', array('id' => $post->getId()));
        }

        return $this->render('post/edit.html.twig', array(
            'post' => $post,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a Post entity.
     *
     */
    public function deleteAction(Request $request, Post $post)
    {
        $form = $this->createDeleteForm($post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($post);
            $em->flush();
        }

        return $this->redirectToRoute('post_index');
    }

    /**
     * Creates a form to delete a Post entity.
     *
     * @param Post $post The Post entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(Post $post)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('post_delete', array('id' => $post->getId())))
            ->setMethod('DELETE')
            ->getForm()
            ;
    }

    public function apiIndexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $posts = $em->getRepository('IKNSABlogBundle:Post')->getLastInserted('IKNSABlogBundle:Post', 3);

        return new JsonResponse(array(
            'posts' => $posts
        ));
    }
}